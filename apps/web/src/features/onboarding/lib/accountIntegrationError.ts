import type { AccountIntegrationRequiredData } from '../api/types';

/**
 * 회원가입 제출 시 이메일·전화번호가 모두 기존 회원과 일치해
 * 계정 통합이 필요한 경우 던지는 도메인 에러
 */
export class AccountIntegrationRequiredError extends Error {
  readonly integrationToken: string;
  readonly expiresInSeconds: number;
  readonly guideMessage: string;

  constructor({
    integrationToken,
    expiresInSeconds,
    guideMessage,
  }: Omit<AccountIntegrationRequiredData, 'reason'>) {
    super(guideMessage);
    this.name = 'AccountIntegrationRequiredError';
    this.integrationToken = integrationToken;
    this.expiresInSeconds = expiresInSeconds;
    this.guideMessage = guideMessage;
  }
}

export function isAccountIntegrationRequiredError(
  error: unknown,
): error is AccountIntegrationRequiredError {
  return error instanceof AccountIntegrationRequiredError;
}
