export type NativePushPlatform = 'IOS' | 'ANDROID';

export type NativePushToken = {
  token: string;
  platform: NativePushPlatform;
};

/** 네이티브가 토큰을 주입한 뒤 발생시키는 이벤트. */
export const NATIVE_PUSH_EVENT = 'surf:native-push';

export const isNativeApp = () =>
  typeof window !== 'undefined' && window.__SURF_NATIVE__ !== undefined;

function parseNativePushToken(value: unknown): NativePushToken | null {
  if (typeof value !== 'object' || value === null) return null;

  const { token, platform } = value as { token?: unknown; platform?: unknown };
  if (typeof token !== 'string' || token.length === 0) return null;
  if (platform !== 'IOS' && platform !== 'ANDROID') return null;

  return { token, platform };
}

export const getNativePushToken = (): NativePushToken | null => {
  if (typeof window === 'undefined') return null;

  return parseNativePushToken(window.__SURF_NATIVE_PUSH__);
};

/**
 * 네이티브가 넘겨준 FCM 토큰을 구독한다.
 * 주입 시점이 페이지 로드보다 늦을 수 있어서 현재 값과 이후 갱신을 모두 다룬다.
 */
export const subscribeToNativePushToken = (listener: (value: NativePushToken) => void) => {
  if (typeof window === 'undefined') return () => {};

  const current = getNativePushToken();
  if (current) listener(current);

  const handle = () => {
    const next = getNativePushToken();
    if (next) listener(next);
  };

  window.addEventListener(NATIVE_PUSH_EVENT, handle);
  return () => window.removeEventListener(NATIVE_PUSH_EVENT, handle);
};
