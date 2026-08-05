export const SIGNUP_CONFLICT_REASONS = {
  /** 이메일·전화번호가 모두 기존 회원과 일치 -> 계정 통합 플로우로 분기 */
  INTEGRATION_REQUIRED: 'ACCOUNT_INTEGRATION_REQUIRED',
  /** 이메일 또는 전화번호 중 하나만 겹침 -> 가입 차단 */
  CONFLICT_BLOCKED: 'ACCOUNT_CONFLICT_BLOCKED',
} as const;

export type AccountIntegrationRequiredData = {
  reason: typeof SIGNUP_CONFLICT_REASONS.INTEGRATION_REQUIRED;
  /** 1회성 통합 토큰. 불투명 문자열이므로 파싱하지 않는다. */
  integrationToken: string;
  /** 잔여 유효시간(초). 발급 직후 1800(30분) */
  expiresInSeconds: number;
  guideMessage: string;
};

export type AccountConflictBlockedData = {
  reason: typeof SIGNUP_CONFLICT_REASONS.CONFLICT_BLOCKED;
};

export type SignupConflictResponse = {
  code: number;
  message: string;
  data: AccountIntegrationRequiredData | AccountConflictBlockedData | null;
};
