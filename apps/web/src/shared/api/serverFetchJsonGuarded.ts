import 'server-only';
import type { Guard, ServerFetchOptions } from './types';
import { serverFetchWithCookies } from './serverFetchWithCookies';

const BODY_PREVIEW_LIMIT = 500;

export function previewBody(raw: unknown): string {
  try {
    const json = JSON.stringify(raw) ?? String(raw);
    return json.length > BODY_PREVIEW_LIMIT ? `${json.slice(0, BODY_PREVIEW_LIMIT)}…` : json;
  } catch {
    return '[unserializable body]';
  }
}

export async function serverFetchJsonGuarded<T>(
  path: string,
  guard: Guard<T>,
  init: ServerFetchOptions = {},
): Promise<T> {
  const res = await serverFetchWithCookies(path, init);

  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);

  const raw: unknown = await res.json();
  if (!guard(raw)) {
    throw new Error(`Invalid response shape for ${path}: ${previewBody(raw)}`);
  }

  return raw;
}
