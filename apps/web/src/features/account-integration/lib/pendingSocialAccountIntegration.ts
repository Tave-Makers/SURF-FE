import type { SocialProvider } from '../api/types';

const STORAGE_KEY = 'surf:pending-social-account-integration';
const MAX_AGE_MS = 30 * 60 * 1000;

export type PendingSocialAccountIntegration = {
  integrationToken: string;
  provider: SocialProvider;
  createdAt: number;
};

function getSessionStorage(): Storage | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function parsePendingSocialAccountIntegration(
  value: string | null,
): PendingSocialAccountIntegration | null {
  if (!value) return null;

  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed !== 'object' || parsed === null) return null;

    const data = parsed as Record<string, unknown>;
    if (typeof data.integrationToken !== 'string') return null;
    if (data.provider !== 'KAKAO' && data.provider !== 'APPLE') return null;
    if (typeof data.createdAt !== 'number') return null;

    return {
      integrationToken: data.integrationToken,
      provider: data.provider,
      createdAt: data.createdAt,
    };
  } catch {
    return null;
  }
}

export function savePendingSocialAccountIntegration(
  integration: Omit<PendingSocialAccountIntegration, 'createdAt'>,
) {
  const storage = getSessionStorage();
  if (!storage) return;

  try {
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...integration,
        createdAt: Date.now(),
      }),
    );
  } catch {
    // OAuth 로그인 자체는 진행할 수 있게 둔다.
  }
}

export function getPendingSocialAccountIntegration(): PendingSocialAccountIntegration | null {
  const storage = getSessionStorage();
  if (!storage) return null;

  let value: string | null = null;
  try {
    value = storage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  const integration = parsePendingSocialAccountIntegration(value);
  if (!integration) return null;

  if (Date.now() - integration.createdAt > MAX_AGE_MS) {
    clearPendingSocialAccountIntegration();
    return null;
  }

  return integration;
}

export function clearPendingSocialAccountIntegration() {
  const storage = getSessionStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // noop
  }
}
