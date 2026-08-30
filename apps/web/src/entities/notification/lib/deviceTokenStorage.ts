/**
 * 이 기기에 등록한 FCM 토큰 보관소.
 *
 * 로그아웃할 때 서버에 삭제 요청을 보내려면 등록 시점의 토큰 값이 그대로 필요하다.
 * 저장소는 사파리 프라이빗/WebView 등에서 접근 자체가 throw할 수 있어 모두 감싼다.
 */
const DEVICE_TOKEN_KEY = 'fcmDeviceToken';

/** 한 세션 안에서 웹 푸시 등록을 중복 실행하지 않기 위한 플래그 */
export const FCM_REGISTERED_FLAG_KEY = 'isFcmRegistered';

let registeredDeviceTokenFallback: string | null = null;

export function saveRegisteredDeviceToken(token: string): boolean {
  registeredDeviceTokenFallback = token;

  try {
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
    return true;
  } catch {
    // 저장소가 막혀도 같은 런타임 안에서는 fallback으로 삭제를 시도할 수 있다
    return false;
  }
}

export function readRegisteredDeviceToken(): string | null {
  try {
    return localStorage.getItem(DEVICE_TOKEN_KEY) ?? registeredDeviceTokenFallback;
  } catch {
    return registeredDeviceTokenFallback;
  }
}

export function saveFcmRegisteredFlag() {
  try {
    sessionStorage.setItem(FCM_REGISTERED_FLAG_KEY, 'true');
  } catch {
    // 플래그 저장 실패 시 중복 등록될 수 있으나, 서버 등록 결과와 토큰 보관은 유지한다
  }
}

export function clearFcmRegisteredFlag() {
  try {
    sessionStorage.removeItem(FCM_REGISTERED_FLAG_KEY);
  } catch {
    // ignore
  }
}

export function clearRegisteredDeviceToken() {
  registeredDeviceTokenFallback = null;

  try {
    localStorage.removeItem(DEVICE_TOKEN_KEY);
  } catch {
    // ignore
  }
}

/** 보관 중인 토큰과 세션 등록 플래그를 함께 비운다 (같은 세션에서 재로그인하면 다시 등록되도록) */
export function clearDeviceTokenRegistration() {
  clearRegisteredDeviceToken();
  clearFcmRegisteredFlag();
}
