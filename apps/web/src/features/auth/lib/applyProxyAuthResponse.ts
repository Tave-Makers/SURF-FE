import { NextResponse } from 'next/server';

import {
  applyAccessTokenCookie,
  applyUpstreamSetCookies,
  extractAccessToken,
  getSetCookies,
} from '@/shared/lib/proxyCookie';

export function applyProxyAuthToResponse(
  res: NextResponse,
  upstream: Response,
  parsedBody: unknown,
) {
  applyUpstreamSetCookies(res, getSetCookies(upstream));

  const token = extractAccessToken(parsedBody);
  if (token) {
    applyAccessTokenCookie(res, token);
  }
}
