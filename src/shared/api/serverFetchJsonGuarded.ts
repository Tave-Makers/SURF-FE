import { serverFetchWithCookies } from './serverFetchWithCookies';

type ServerFetchOptions = Omit<globalThis.RequestInit, 'headers'> & {
  headers?: Record<string, string>;
};

export type Guard<T> = (x: unknown) => x is T;

export async function serverFetchJsonGuarded<T>(
  path: string,
  guard: Guard<T>,
  init: ServerFetchOptions = {},
): Promise<T> {
  const url = `${process.env.API_BASE_URL}${path}`;

  const res = await serverFetchWithCookies(url, {
    ...init,
    cache: 'no-store',
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
