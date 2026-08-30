/**
 * 이 기기에 등록한 FCM 토큰 보관소.
 *
 * 로그아웃할 때 서버에 삭제 요청을 보내려면 등록 시점의 토큰 값이 그대로 필요하다.
 * 저장소는 사파리 프라이빗/WebView 등에서 접근 자체가 throw할 수 있어 모두 감싼다.
 */
const DEVICE_TOKEN_KEY = 'fcmDeviceToken';

/** 한 세션 안에서 웹 푸시 등록을 중복 실행하지 않기 위한 플래그 */
export const FCM_REGISTERED_FLAG_KEY = 'isFcmRegistered';

export function saveRegisteredDeviceToken(token: string) {
  try {
    localStorage.setItem(DEVICE_TOKEN_KEY, token);
  } catch {
    // 저장 실패 시 로그아웃에서 토큰을 못 지울 뿐, 등록 자체는 유효하다
  }
}

export function readRegisteredDeviceToken(): string | null {
  try {
    return localStorage.getItem(DEVICE_TOKEN_KEY);
  } catch {
    return null;
  }
}

/** 보관 중인 토큰과 세션 등록 플래그를 함께 비운다 (같은 세션에서 재로그인하면 다시 등록되도록) */
export function clearDeviceTokenRegistration() {
  try {
    localStorage.removeItem(DEVICE_TOKEN_KEY);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(FCM_REGISTERED_FLAG_KEY);
  } catch {
    // ignore
  }
}
