import 'server-only';
import { cookies } from 'next/headers';
import type { ServerFetchOptions } from './types';

const BACKEND = process.env.API_BASE_URL;

function toBackendPath(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return p.startsWith('/api/proxy') ? p.replace(/^\/api\/proxy/, '') || '/' : p;
}

function buildBackendUrl(path: string): string {
  if (!BACKEND) {
    throw new Error('API_BASE_URL is not configured');
  }

  const base = BACKEND.replace(/\/+$/, '');
  return `${base}${toBackendPath(path)}`;
}

function buildCookieHeader(store: { getAll(): { name: string; value: string }[] }) {
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

export async function serverFetchWithCookies(path: string, options: ServerFetchOptions = {}) {
  const url = buildBackendUrl(path);

  const cookieStore = await cookies();
  const cookie = buildCookieHeader(cookieStore);
  const accessToken = cookieStore.get('accessToken')?.value;

  const headersObj: Record<string, string> = {
    'X-Client-Type': 'WEB',
    ...(options.headers ?? {}),
    ...(cookie ? { cookie } : {}),
  };

  if (accessToken && !headersObj.authorization && !headersObj.Authorization) {
    headersObj.authorization = `Bearer ${accessToken}`;
  }

  return fetch(url, {
    ...options,
    headers: headersObj,
    cache: options.cache ?? 'no-store',
  });
}
