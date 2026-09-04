import axios from 'axios';
import { handleApiError } from '@/shared/lib/handleApiError';
import { OnBoardingRequest, OnBoardingResponse } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { AccountIntegrationRequiredError } from '../lib/accountIntegrationError';
import { toSignupErrorMessage } from '../lib/signupErrorMessage';
import { SIGNUP_CONFLICT_REASONS, SignupConflictResponse } from './types';

export async function submitOnBoarding(data: OnBoardingRequest) {
  try {
    const res = await axiosInstance.post<OnBoardingResponse>('v1/user/members/signup', data);
    return res.data;
  } catch (error) {
    // 409 + ACCOUNT_INTEGRATION_REQUIRED -> 계정 통합 플로우
    if (axios.isAxiosError(error) && error.response?.status === 409) {
      const body = error.response.data as SignupConflictResponse | undefined;

      if (body?.data?.reason === SIGNUP_CONFLICT_REASONS.INTEGRATION_REQUIRED) {
        throw new AccountIntegrationRequiredError({
          integrationToken: body.data.integrationToken,
          expiresInSeconds: body.data.expiresInSeconds,
          guideMessage: body.data.guideMessage || body.message,
        });
      }
    }

    // 서버가 준 문구는 사용자에게 그대로 노출하지 않는다.
    // 사유 코드만 읽어 프론트가 가진 문구로 바꾸고, 모르는 코드는 기본 문구로 처리한다.
    if (axios.isAxiosError(error) && error.response) {
      const body = error.response.data as { message?: unknown } | undefined;
      const reasonCode = typeof body?.message === 'string' ? body.message : '';

      console.error(`[Signup Error] ${reasonCode} (status=${error.response.status})`);

      throw new Error(toSignupErrorMessage(reasonCode));
    }

    // 네트워크 실패 등 응답 자체가 없는 경우는 handleApiError 가 자체 문구를 만든다.
    throw handleApiError(error, '회원가입에 실패했습니다.');
  }
}
