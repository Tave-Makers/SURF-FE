import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const AUTH_VALID_PATH = '/v1/user/members/valid-status';
const DASHBOARD_PATH = '/api/dashboard/v2';
const DASHBOARD_TIMEOUT_MS = 10_000;
const ADMIN_ROLES = new Set(['ADMIN', 'PRESIDENT', 'MANAGER', 'admin', 'president', 'manager']);

type AuthResult =
  | { ok: true }
  | { ok: false; status: 401 | 403 | 500; message: string };

function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function buildRequiredBaseUrl(name: string, options: { requireHttpsInProduction?: boolean } = {}) {
  const raw = getRequiredEnv(name);
  const url = new URL(raw);

  if (options.requireHttpsInProduction && process.env.NODE_ENV === 'production' && url.protocol !== 'https:') {
    throw new Error(`${name} must use https in production`);
  }

  return raw;
}

function buildDashboardUrl(req: NextRequest) {
  const targetUrl = new URL(
    DASHBOARD_PATH,
    buildRequiredBaseUrl('DASHBOARD_API_BASE_URL', { requireHttpsInProduction: true }),
  );
  const startDate = req.nextUrl.searchParams.get('start_date');
  const endDate = req.nextUrl.searchParams.get('end_date');

  if (startDate) targetUrl.searchParams.set('start_date', startDate);
  if (endDate) targetUrl.searchParams.set('end_date', endDate);

  return targetUrl;
}

function buildAuthUrl() {
  return new URL(AUTH_VALID_PATH, buildRequiredBaseUrl('API_BASE_URL'));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function extractRole(value: unknown): unknown {
  if (!isRecord(value)) return null;

  const data = value['data'];
  if (isRecord(data)) {
    return data['memberRole'] ?? data['role'] ?? data['userRole'];
  }

  return value['memberRole'] ?? value['role'] ?? value['userRole'];
}

function isAdminRole(role: unknown) {
  return typeof role === 'string' && ADMIN_ROLES.has(role);
}

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === 'TimeoutError';
}

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

async function verifyDashboardAccess(req: NextRequest): Promise<AuthResult> {
  const accessToken = req.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return { ok: false, status: 401, message: '인증이 필요합니다.' };
  }

  let response: Response;

  try {
    response = await fetch(buildAuthUrl(), {
      method: 'GET',
      cache: 'no-store',
      headers: {
        authorization: `Bearer ${accessToken}`,
        'X-Client-Type': 'WEB',
      },
      signal: AbortSignal.timeout(DASHBOARD_TIMEOUT_MS),
    });
  } catch (error) {
    console.error('[dashboard] auth validation failed:', errorMessage(error));
    return { ok: false, status: 500, message: '인증 상태를 확인하지 못했습니다.' };
  }

  if (response.status === 401) {
    return { ok: false, status: 401, message: '인증이 필요합니다.' };
  }

  if (!response.ok) {
    console.error('[dashboard] auth validation returned non-ok status:', response.status);
    return { ok: false, status: 500, message: '인증 상태를 확인하지 못했습니다.' };
  }

  const body: unknown = await response.json().catch(() => null);
  const role = extractRole(body);

  if (!isAdminRole(role)) {
    console.warn('[dashboard] forbidden dashboard access:', { role });
    return { ok: false, status: 403, message: '대시보드 접근 권한이 없습니다.' };
  }

  return { ok: true };
}

export async function GET(req: NextRequest) {
  let targetUrl: URL;

  try {
    targetUrl = buildDashboardUrl(req);
  } catch (error) {
    console.error('[dashboard] invalid environment configuration:', errorMessage(error));
    return jsonError('서버 설정이 올바르지 않습니다.', 500);
  }

  const auth = await verifyDashboardAccess(req);
  if (!auth.ok) {
    return jsonError(auth.message, auth.status);
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      cache: 'no-store',
      signal: AbortSignal.timeout(DASHBOARD_TIMEOUT_MS),
    });

    const text = await response.text();

    return new NextResponse(text, {
      status: response.status,
      headers: {
        'content-type': response.headers.get('content-type') ?? 'application/json',
      },
    });
  } catch (error) {
    const status = isAbortError(error) ? 504 : 502;
    const message = status === 504 ? '대시보드 요청 시간이 초과되었습니다.' : '대시보드 데이터를 불러오지 못했습니다.';

    console.error('[dashboard] upstream request failed:', {
      status,
      message: errorMessage(error),
    });

    return jsonError(message, status);
  }
}
