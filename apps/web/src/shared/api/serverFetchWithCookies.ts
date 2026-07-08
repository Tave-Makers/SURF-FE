import 'server-only';
import { cookies } from 'next/headers';
import type { ServerFetchOptions } from './types';
import { getAppOrigin } from '@/shared/lib/appOrigin';

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

export async function serverFetchWithCookies(path: string, options: ServerFetchOptions = {}) {
  const baseUrl = await getAppOrigin();
  const url = `${baseUrl}${toProxyPath(path)}`;

  const cookieStore = await cookies();
  const cookie = buildCookieHeader(cookieStore);

  const headersObj: Record<string, string> = {
    ...(options.headers ?? {}),
    ...(cookie ? { cookie } : {}),
  };

  return fetch(url, {
    ...options,
    headers: headersObj,
    cache: options.cache ?? 'no-store',
  });
}
