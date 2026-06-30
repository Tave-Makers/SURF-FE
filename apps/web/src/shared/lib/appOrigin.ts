import 'server-only';

import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

const DEFAULT_DEV_ORIGIN = 'https://localhost:443';
const DEFAULT_PROD_ORIGIN = 'https://www.tavesurf.site';

function normalizeOrigin(url: string): string {
  return url.replace(/\/+$/, '');
}

function getConfiguredOrigin(): string | undefined {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  return url ? normalizeOrigin(url) : undefined;
}

function resolveOrigin(host: string | null, proto: string): string {
  const configured = getConfiguredOrigin();
  if (configured) return configured;

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PROD_ORIGIN;
  }

  if (host) {
    return `${proto}://${host}`;
  }

  return DEFAULT_DEV_ORIGIN;
}

export function getAppOriginFromRequest(req: NextRequest): string {
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  const proto = req.headers.get('x-forwarded-proto') ?? 'http';
  return resolveOrigin(host, proto);
}

export async function getAppOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  return resolveOrigin(host, proto);
}
