import 'server-only';
import { cookies, headers } from 'next/headers';
import type { ServerFetchOptions } from './types';

export async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return host ? `${proto}://${host}` : 'http://localhost:3000';
}

function toProxyPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return p.startsWith('/api/proxy') ? p : `/api/proxy${p}`;
}

function buildCookieHeader(store: { getAll(): { name: string; value: string }[] }) {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

/**
 * Server Component/Route Handler 환경에서 현재 요청의 쿠키를 전달해
 * 내부 `/api/proxy/*` 경로를 호출합니다.
 *
 * - 전달받은 `path`는 자동으로 `/api/proxy` prefix가 보정됩니다.
 * - `options.cache`를 지정하지 않으면 기본값으로 `no-store`를 사용합니다.
 * - 응답 본문은 JSON으로 파싱해 반환합니다.
 */
export async function serverFetchWithCookies<TResponse = unknown>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<TResponse> {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${toProxyPath(path)}`;

  const cookieStore = await cookies();
  const cookie = buildCookieHeader(cookieStore);

  const headersObj: Record<string, string> = {
    ...(options.headers ?? {}),
    ...(cookie ? { cookie } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: headersObj,
    cache: options.cache ?? 'no-store',
  });

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as { message?: string } | null;

    throw new Error(errorBody?.message ?? `Request failed (${response.status})`);
  }

  return response.json() as Promise<TResponse>;
}
