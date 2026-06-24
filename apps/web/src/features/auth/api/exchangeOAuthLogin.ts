import type { OAuthLoginData } from './types';

const TIMEOUT_MS = 15_000;

type OAuthProvider = 'apple' | 'kakao';

type ExchangeOAuthLoginParams = {
  provider: OAuthProvider;
  code: string;
  state: string;
  origin: string;
  cookieHeader?: string;
  user?: string;
};

type ExchangeOAuthLoginSuccess = {
  ok: true;
  data: OAuthLoginData;
  upstream: Response;
  parsed: unknown;
};

type ExchangeOAuthLoginFailure = {
  ok: false;
  message: string;
  status?: number;
};

export type ExchangeOAuthLoginResult = ExchangeOAuthLoginSuccess | ExchangeOAuthLoginFailure;

const PROVIDER_CONFIG: Record<
  OAuthProvider,
  {
    method: 'GET' | 'POST';
    endpoint: string;
    label: string;
  }
> = {
  apple: {
    method: 'POST',
    endpoint: '/api/proxy/login/oauth2/code/apple',
    label: '애플',
  },
  kakao: {
    method: 'GET',
    endpoint: '/api/proxy/login/oauth2/code/kakao',
    label: '카카오',
  },
};

async function fetchWithTimeout(url: string, init: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function exchangeOAuthLogin({
  provider,
  code,
  state,
  user,
  origin,
  cookieHeader,
}: ExchangeOAuthLoginParams): Promise<ExchangeOAuthLoginResult> {
  const config = PROVIDER_CONFIG[provider];
  const url = new URL(config.endpoint, origin);
  url.searchParams.set('code', code);
  url.searchParams.set('state', state);
  if (user) url.searchParams.set('user', user);

  try {
    const headers: Record<string, string> = { 'X-Client-Type': 'WEB' };
    if (cookieHeader) headers['Cookie'] = cookieHeader;

    const upstream = await fetchWithTimeout(url.toString(), {
      method: config.method,
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
        message: getOAuthLoginErrorMessage(provider, upstream.status),
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
      message: `${config.label} 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.`,
    };
  }
}

function extractLoginData(parsed: unknown): OAuthLoginData | null {
  if (!isRecord(parsed)) return null;

  const data = isRecord(parsed.data) ? parsed.data : parsed;
  const email = data.email;

  if (typeof email !== 'string') return null;

  return {
    nickname: typeof data.nickname === 'string' ? data.nickname : '',
    email,
    profileImageUrl: typeof data.profileImageUrl === 'string' ? data.profileImageUrl : '',
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function getOAuthLoginErrorMessage(provider: OAuthProvider, status: number) {
  switch (status) {
    case 400:
      return '로그인 요청이 만료됐어요. 다시 로그인해주세요.';
    case 409:
      return '이미 가입된 계정이에요. 기존 로그인 방식으로 다시 시도해주세요.';
    default:
      return `${PROVIDER_CONFIG[provider].label} 로그인에 실패했어요. 잠시 후 다시 시도해주세요.`;
  }
}
