/**
 * 휴대폰 번호 형식 — 010으로 시작하는 11자리 숫자.
 *
 * 온보딩 폼 규칙 / 다음 버튼 게이팅 / 프로필 수정이 각자 다른 정규식을 쓰고 있어
 * 게이팅은 통과하는데 필드 검증에서 막히는 상태가 있었다. 한 곳에서만 정의한다.
 */
export const PHONE_NUMBER_REGEX = /^010\d{8}$/;

export const PHONE_NUMBER_ERROR_MESSAGE = '010으로 시작하는 11자리 숫자로 입력해주세요.';

/** 선택 입력이므로 비어 있으면 통과, 값이 있으면 형식을 본다. */
export const isValidPhoneNumber = (value: string | undefined | null) =>
  !value?.trim() || PHONE_NUMBER_REGEX.test(value);

export const onlyDigits = (raw: string) => raw.replace(/\D/g, '').slice(0, 11);

export const formatPhoneNumber = (digits: string) => {
  const d = onlyDigits(digits);

  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
};
