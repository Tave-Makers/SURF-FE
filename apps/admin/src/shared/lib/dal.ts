import 'server-only';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';

const TIMEOUT_MS = 15_000;

const VALID_PATH = '/api/proxy/v1/user/members/valid-status';

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

/**
 * 인증 실패로 볼 상태 코드.
 * 서버(Spring Security)는 토큰이 아예 없으면 403, 만료·무효면 401을 준다.
 */
function isAuthFailure(status: number): boolean {
  return status === 401 || status === 403;
}

/**
 * "로그인 아님이 확정된 경우"에만 /login으로 보낸다.
 *
 * 확정 = valid-status가 인증 실패(401/403)를 준 뒤, 그걸 복구하려던 refresh 자체가
 * 실패했거나 refresh는 성공했지만 재검증까지 실패한 경우다.
 * 그 외(네트워크 에러, 타임아웃, 5xx 등)는 로그인 문제가 아니라 일시적인 인프라
 * 문제일 수 있으므로 로그인으로 보내지 않는다.
 * 대신 일반 에러로 던져 (protected) 트리의 error.tsx(재시도 가능)로 위임한다.
 */
export async function verifySession() {
  // headers()/cookies()는 정적 생성 시도 중엔 Next.js가 "이 라우트는 dynamic이다"라고
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

    // 인증 실패가 아니면(5xx 등) "로그인 안 됨"이 아니라 다른 문제다. 로그인으로 보내지 않는다.
    // 서버는 토큰이 아예 없으면 403, 만료·무효면 401을 주므로 둘 다 인증 실패로 본다.
    if (!isAuthFailure(res.status)) {
      throw new Error(`[Auth] valid-status 응답 이상: ${res.status}`);
    }

    // middleware가 페이지 렌더 전에 이미 AT를 갱신했어야 한다(exp까지 확인함).
    // 그런데도 인증 실패면 여기서 refresh를 다시 시도하지 않는다 — RSC는 회전된
    // 쿠키를 브라우저에 못 심어서 RT만 태우고 재사용 감지로 이어질 수 있다.
    // middleware가 이미 걸러줬어야 하는 경우이므로 로그인 아님으로 확정한다.
    redirect(PAGE_ROUTES.LOGIN);
  } catch (error: unknown) {
    if (isNextRedirectError(error)) throw error;

    console.error('[Auth] 세션 확인 실패:', safeErrorMessage(error));
    throw new Error('세션 확인에 실패했습니다. 다시 시도해주세요.');
  }
}
