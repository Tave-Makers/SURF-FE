const TIMEOUT_MS = 15_000;
const BACKEND = process.env.API_BASE_URL;

export type AppLoginCredential =
  | { provider: 'kakao'; accessToken: string }
  | {
      provider: 'apple';
      identityToken: string;
      nonce: string;
      authorizationCode: string;
      name: string;
    };

export type AppLoginData = {
  nickname: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  profileImageUrl: string;
};

type ExchangeAppLoginResult =
  | { ok: true; data: AppLoginData }
  | { ok: false; message: string; status?: number };

const ENDPOINT: Record<AppLoginCredential['provider'], string> = {
  kakao: '/login/kakao/app',
  apple: '/login/apple/app',
};

const LABEL: Record<AppLoginCredential['provider'], string> = {
  kakao: '카카오',
  apple: 'Apple',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return typeof value === 'string' ? value : '';
}

function extractAppLoginData(parsed: unknown): AppLoginData | null {
  if (!isRecord(parsed)) return null;

  const data = isRecord(parsed.data) ? parsed.data : parsed;

  const accessToken = readString(data, 'accessToken');
  const refreshToken = readString(data, 'refreshToken');

  // 둘 중 하나라도 없으면 세션을 만들 수 없다
  if (accessToken.length === 0 || refreshToken.length === 0) return null;

  return {
    accessToken,
    refreshToken,
    nickname: readString(data, 'nickname'),
    email: readString(data, 'email'),
    profileImageUrl: readString(data, 'profileImageUrl'),
  };
}

function buildRequestBody(credential: AppLoginCredential): string {
  if (credential.provider === 'kakao') {
    return JSON.stringify({ accessToken: credential.accessToken });
  }

  return JSON.stringify({
    identityToken: credential.identityToken,
    nonce: credential.nonce,
    authorizationCode: credential.authorizationCode,
    name: credential.name,
  });
}

function getErrorMessage(provider: AppLoginCredential['provider'], status: number): string {
  switch (status) {
    case 400:
    case 401:
      return '로그인 정보가 만료됐어요. 다시 시도해주세요.';
    case 409:
      return '이미 가입된 계정이에요. 기존 로그인 방식으로 다시 시도해주세요.';
    default:
      return `${LABEL[provider]} 로그인에 실패했어요. 잠시 후 다시 시도해주세요.`;
  }
}

/** 네이티브 SDK 토큰을 백엔드에 넘겨 SURF JWT 로 교환한다. */
export async function exchangeAppLogin(
  credential: AppLoginCredential,
): Promise<ExchangeAppLoginResult> {
  if (!BACKEND) {
    console.error('[AppLogin] API_BASE_URL 이 설정되지 않았습니다');
    return { ok: false, message: '서버 설정 오류로 로그인할 수 없어요.' };
  }

  const url = `${BACKEND.replace(/\/+$/, '')}${ENDPOINT[credential.provider]}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      redirect: 'manual',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Client-Type': 'APP',
      },
      body: buildRequestBody(credential),
    });

    const text = await upstream.text();

    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }

    if (!upstream.ok) {
      // 토큰이 로그에 남지 않도록 상태 코드만 남긴다
      console.warn('[AppLogin] upstream 실패', {
        provider: credential.provider,
        status: upstream.status,
      });
      return {
        ok: false,
        message: getErrorMessage(credential.provider, upstream.status),
        status: upstream.status,
      };
    }

    const data = extractAppLoginData(parsed);
    if (!data) {
      console.warn('[AppLogin] 응답에 토큰이 없습니다', { provider: credential.provider });
      return { ok: false, message: '로그인 응답이 비어있어요.' };
    }

    return { ok: true, data };
  } catch (error) {
    console.error('[AppLogin] 요청 실패', error instanceof Error ? error.message : String(error));
    return {
      ok: false,
      message: `${LABEL[credential.provider]} 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.`,
    };
  } finally {
    clearTimeout(timer);
  }
}
