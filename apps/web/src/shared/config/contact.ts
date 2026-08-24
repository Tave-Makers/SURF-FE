/**
 * 운영팀 공개 연락처.
 *
 * App Store 심사 지침 1.2(사용자 생성 콘텐츠)와 1.5(개발자 정보)는
 * 사용자가 앱 안에서 개발자에게 바로 연락할 수 있는 수단을 요구한다.
 * 약관·처리방침 본문과 설정 화면이 같은 값을 쓰도록 여기서 한 번만 정의한다.
 */
export const SUPPORT_EMAIL = 'tavemakers@gmail.com';

/** 설정 → 문의하기에서 메일 앱을 열 때 쓰는 mailto 링크 */
export const SUPPORT_MAILTO = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
  '[SURF] 문의드립니다',
)}`;
