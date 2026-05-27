import type { OAuthLoginData } from './types';

type ExchangeAppleLoginParams = {
  code: string;
  state: string;
  user?: string;
};

type ExchangeAppleLoginSuccess = {
  ok: true;
  data: OAuthLoginData;
  upstream: Response;
  parsed: unknown;
};

type ExchangeAppleLoginFailure = {
  ok: false;
  message: string;
  status?: number;
};

export type ExchangeAppleLoginResult = ExchangeAppleLoginSuccess | ExchangeAppleLoginFailure;

export async function exchangeAppleLogin(
  params: ExchangeAppleLoginParams,
  origin: string,
  cookieHeader?: string,
): Promise<ExchangeAppleLoginResult> {
  const url = new URL('/api/proxy/login/oauth2/code/apple', origin);
  url.searchParams.set('code', params.code);
  url.searchParams.set('state', params.state);
  if (params.user) url.searchParams.set('user', params.user);

  try {
    const headers: Record<string, string> = { 'X-Client-Type': 'WEB' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const upstream = await fetch(url.toString(), {
      method: 'POST',
      headers,
      cache: 'no-store',
    });

    const text = await upstream.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    if (!upstream.ok) {
      return {
        ok: false,
        message: getAppleLoginErrorMessage(upstream.status),
        status: upstream.status,
      };
    }

    const loginData = extractLoginData(parsed);
    if (!loginData) {
      return { ok: false, message: '로그인 응답이 비어있어요.' };
    }

    return { ok: true, data: loginData, upstream, parsed };
  } catch {
    return {
      ok: false,
      message: '애플 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.',
    };
  }
}

function extractLoginData(parsed: unknown): OAuthLoginData | null {
  if (!isRecord(parsed)) return null;

  const data = isRecord(parsed.data) ? parsed.data : parsed;

  const email = data.email;

  if (typeof email !== 'string') {
    return null;
  }

  return {
    nickname: typeof data.nickname === 'string' ? data.nickname : '',
    email,
    profileImageUrl: typeof data.profileImageUrl === 'string' ? data.profileImageUrl : '',
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function getAppleLoginErrorMessage(status: number) {
  switch (status) {
    case 400:
      return '로그인 요청이 만료됐어요. 다시 로그인해주세요.';
    case 409:
      return '이미 가입된 계정이에요. 기존 로그인 방식으로 다시 시도해주세요.';
    default:
      return '애플 로그인에 실패했어요. 잠시 후 다시 시도해주세요.';
  }
}
