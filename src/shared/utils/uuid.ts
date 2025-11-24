/**
 * 환경(특히 iOS 인앱 브라우저)에 따라 crypto.randomUUID가 없는 경우가 있어
 * UUID를 안전하게 생성하기 위한 폴리필 함수
 */
export function safeUUID() {
  // 최신 브라우저 지원
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // 네이버/카톡 인앱 브라우저 fallback
  return 'xxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
