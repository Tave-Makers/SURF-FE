import 'server-only';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers';
import { PAGE_ROUTES } from '@/shared/config/path';
import type { ServerFetchOptions } from './types';

async function getBaseUrl(): Promise<string> {
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

export async function serverFetchWithCookies(path: string, options: ServerFetchOptions = {}) {
  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}${toProxyPath(path)}`;

  const cookieStore = await cookies();
  const cookie = buildCookieHeader(cookieStore);

  const { authRedirect = true, ...fetchOptions } = options;
  const headersObj: Record<string, string> = {
    ...(fetchOptions.headers ?? {}),
    ...(cookie ? { cookie } : {}),
  };

  const res = await fetch(url, {
    ...fetchOptions,
    headers: headersObj,
    cache: fetchOptions.cache ?? 'no-store',
  });

  if (authRedirect && (res.status === 401 || res.status === 403)) {
    redirect(PAGE_ROUTES.LOGIN);
  }

  return res;
}
