import { SUPPORT_EMAIL } from '@/shared/config/contact';

/**
 * 사용자에게 보여줄 회원가입 실패 문구는 프론트가 소유한다.
 * 서버 문구를 그대로 노출하면 백엔드 리팩터링이 사용자 화면을 바꾸고,
 * 내부용 표기("[회원]" 등)가 그대로 새어 나간다.
 *
 * 키는 백엔드가 실패 사유로 내려주는 코드 문자열이다. 현재는 응답 본문 `message` 에
 * 실려 오지만, 별도 `errorCode` 필드가 생기면 그쪽을 키로 바꾼다.
 */
const SIGNUP_ERROR_MESSAGES: Record<string, string> = {
  MEMBER_ALREADY_EXISTS: '이미 가입된 계정입니다. 로그인 후 이용해주세요.',
  ADMIN_REJECTED: '관리자에 의해 회원가입이 거절되었습니다.',
  MEMBER_BLACKLISTED: `가입이 제한된 계정입니다. 자세한 내용은 ${SUPPORT_EMAIL}로 문의해주세요.`,
  INVALID_ARGUMENT: '입력하신 정보를 다시 확인해주세요.',
  INTERNAL_SERVER_ERROR: '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

/** 모르는 사유 코드가 와도 서버 문구로 되돌아가지 않는다. */
const SIGNUP_ERROR_FALLBACK = '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.';

export const toSignupErrorMessage = (reasonCode: string): string =>
  SIGNUP_ERROR_MESSAGES[reasonCode] ?? SIGNUP_ERROR_FALLBACK;
