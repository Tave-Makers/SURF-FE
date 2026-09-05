import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';

const TIMEOUT_MS = 15_000;

const VALID_PATH = '/api/proxy/v1/user/members/valid-status';
const REFRESH_PATH = '/api/proxy/auth/refresh';

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(t);
  }
}

function isNextRedirectError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return false;
  if (!('digest' in error)) return false;

  const digest = (error as { digest?: unknown }).digest;
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT');
}

function safeErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'string') return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

function buildCookieHeaderFromStore(all: { name: string; value: string }[]) {
  return all.map((c) => `${c.name}=${c.value}`).join('; ');
}

function mergeCookieHeaderWithSetCookie(origHeader: string, setCookies: string[]) {
  if (!setCookies.length) return origHeader;

  const jar = new Map<string, string>();

  // 기존 Cookie 헤더 파싱
  for (const part of origHeader.split(';')) {
    const p = part.trim();
    if (!p) continue;
    const eq = p.indexOf('=');
    if (eq === -1) continue;
    const name = p.slice(0, eq).trim();
    const value = p.slice(eq + 1);
    jar.set(name, value);
  }

  // Set-Cookie로 받은 쿠키로 덮어쓰기
  for (const sc of setCookies) {
    const first = sc.split(';')[0]?.trim();
    if (!first) continue;
    const eq = first.indexOf('=');
    if (eq === -1) continue;
    const name = first.slice(0, eq).trim();
    const value = first.slice(eq + 1);
    jar.set(name, value);
  }

  // Cookie 헤더로 직렬화
  return Array.from(jar.entries())
    .map(([k, v]) => `${k}=${v}`)
    .join('; ');
}

function getSetCookieHeaders(res: Response): string[] {
  const anyHeaders = res.headers as unknown as { getSetCookie?: () => string[] | undefined };
  if (typeof anyHeaders.getSetCookie === 'function') return anyHeaders.getSetCookie() ?? [];

  const single = res.headers.get('set-cookie');
  return single ? [single] : [];
}

/**
 * "로그인 아님이 확정된 경우"에만 /login으로 보낸다.
 *
 * 확정 = valid-status 가 401을 주고, 그걸 복구하려던 refresh 마저 실패한 경우뿐이다.
 * 그 외(네트워크 에러, 타임아웃, valid-status의 401 아닌 실패, refresh 성공 후 재검증 실패 등)는
 * 세션이 멀쩡한데도 일시적인 문제로 로그아웃 취급될 수 있으므로 로그인으로 보내지 않는다.
 * 대신 일반 에러로 던져 (protected) 트리의 error.tsx(재시도 가능)로 위임한다.
 */
export async function verifySession() {
  // headers()/cookies() 는 정적 생성 시도 중엔 Next.js가 "이 라우트는 dynamic이다"라고
  // 알리려고 일부러 예외를 던진다(redirect()의 NEXT_REDIRECT와 같은 원리). try 안에 두면
  // 그 신호가 아래 catch에서 일반 에러로 둔갑해 next build 자체가 실패한다. try 밖에서 미리 읽어
  // Next.js 프레임워크로 그대로 전달되게 한다.
  const baseUrl = await getBaseUrl();
  const cookieStore = await cookies();
  const cookieHeader = buildCookieHeaderFromStore(cookieStore.getAll());

  try {
    const res = await fetchWithTimeout(`${baseUrl}${VALID_PATH}`, {
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    // 최초 검증 성공
    if (res.ok) {
      return;
    }

    // 401이 아니면(403/500 등) "로그인 안 됨"이 아니라 다른 문제다. 로그인으로 보내지 않는다.
    if (res.status !== 401) {
      throw new Error(`[Auth] valid-status 응답 이상: ${res.status}`);
    }

    // 401 -> refresh 시도
    const refresh = await fetchWithTimeout(`${baseUrl}${REFRESH_PATH}`, {
      method: 'POST',
      cache: 'no-store',
      headers: cookieHeader ? { cookie: cookieHeader } : {},
    });

    // refresh 자체가 실패 = 재발급도 안 된다는 뜻이므로 로그인 아님이 확정된다. 여기서만 리다이렉트.
    if (!refresh.ok) redirect(PAGE_ROUTES.LOGIN);

    const setCookies = getSetCookieHeaders(refresh);
    const newCookieHeader = mergeCookieHeaderWithSetCookie(cookieHeader, setCookies);

    const retry = await fetchWithTimeout(`${baseUrl}${VALID_PATH}`, {
      cache: 'no-store',
      headers: newCookieHeader ? { cookie: newCookieHeader } : {},
    });

    // refresh는 성공했는데 재검증이 또 실패 -> 확정된 로그아웃이 아니라 애매한 상태.
    // 로그인으로 보내면 방금 새로 받은 토큰을 버리는 셈이므로 에러 화면으로 위임한다.
    if (!retry.ok) {
      throw new Error(`[Auth] refresh 후 재검증 실패: ${retry.status}`);
    }
  } catch (error: unknown) {
    if (isNextRedirectError(error)) throw error;

    console.error(
      '[Auth] 세션 확인 실패 (로그인 아님으로 단정하지 않고 에러 화면으로 위임):',
      safeErrorMessage(error),
    );
    throw new Error('세션 확인에 실패했습니다. 다시 시도해주세요.');
  }
}
