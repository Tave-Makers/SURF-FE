import type { ServerFetchOptions } from './types';
import type { Guard } from './types';
import { serverFetchWithCookies } from './serverFetchWithCookies';

export async function serverFetchJsonGuarded<T>(
  path: string,
  guard: Guard<T>,
  init: ServerFetchOptions = {},
): Promise<T> {
  const url = `${process.env.API_BASE_URL}${path}`;

  const res = await serverFetchWithCookies(url, {
    cache: init.cache ?? 'no-store',
    ...init,
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}: ${res.status}`);
  }

  const raw: unknown = await res.json();
  if (!guard(raw)) {
    throw new Error(`Invalid response shape for ${path}`);
  }

  return raw;
}
