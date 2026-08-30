/**
 * 회원 전화번호 정책 — 한국 휴대폰 번호(010으로 시작하는 11자리)만 허용한다.
 *
 * 국가/서비스 정책과 사용자 문구를 담고 있어 shared가 아니라 user 도메인에 둔다.
 * 표기·입력 정규화 같은 범용 처리는 shared/lib/phoneNumber.ts에 남아 있다.
 */
export const PHONE_NUMBER_REGEX = /^010\d{8}$/;

export const PHONE_NUMBER_ERROR_MESSAGE = '010으로 시작하는 11자리 숫자로 입력해주세요.';

/** 전화번호는 선택 입력이므로 비어 있으면 통과, 값이 있으면 형식을 본다. */
export const isValidPhoneNumber = (value: string | undefined | null) =>
  !value?.trim() || PHONE_NUMBER_REGEX.test(value);
