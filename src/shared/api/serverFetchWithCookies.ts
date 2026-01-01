import { cookies } from 'next/headers';
import type { ServerFetchOptions } from './types';

function buildCookieHeader(cookieStore: { getAll(): { name: string; value: string }[] }) {
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');
}

export async function serverFetchWithCookies(input: string, options: ServerFetchOptions = {}) {
  const cookieStore = await cookies();
  const cookie = buildCookieHeader(cookieStore);

  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
    ...(cookie ? { cookie } : {}),
  };

  return fetch(input, {
    ...options,
    headers,
  });
}
