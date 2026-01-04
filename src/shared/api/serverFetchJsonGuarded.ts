import 'server-only';
import type { Guard, ServerFetchOptions } from './types';
import { serverFetchWithCookies } from './serverFetchWithCookies';

export async function serverFetchJsonGuarded<T>(
  path: string,
  guard: Guard<T>,
  init: ServerFetchOptions = {},
): Promise<T> {
  const res = await serverFetchWithCookies(path, init);

  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);

  const raw: unknown = await res.json();
  if (!guard(raw)) throw new Error(`Invalid response shape for ${path}`);

  return raw;
}
