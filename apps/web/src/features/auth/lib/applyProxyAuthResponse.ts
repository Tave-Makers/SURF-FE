import { NextResponse } from 'next/server';

import {
  applyAccessTokenCookie,
  applyUpstreamSetCookies,
  extractAccessToken,
  getSetCookies,
} from '@/shared/lib/proxyCookie';

/**
 * 프록시를 통과한 인증 응답을 브라우저 쿠키에 반영한다.
 *
 * 백엔드는 accessToken 을 Set-Cookie 가 아니라 응답 본문으로 주므로,
 * 업스트림 쿠키를 반영한 뒤 본문에서 토큰을 꺼내 직접 심어야 한다.
 */
export function applyProxyAuthToResponse(
  res: NextResponse,
  upstream: Response,
  parsedBody: unknown,
) {
  const sessionCleared = applyUpstreamSetCookies(res, getSetCookies(upstream));

  // 세션을 끝낸 응답(로그아웃·탈퇴)의 본문에 토큰이 남아 있어도 다시 심지 않는다
  const token = sessionCleared ? null : extractAccessToken(parsedBody);
  if (token) {
    applyAccessTokenCookie(res, token);
  }
}
