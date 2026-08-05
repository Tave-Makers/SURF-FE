import axios from 'axios';
import { handleApiError } from '@/shared/lib/handleApiError';
import { OnBoardingRequest, OnBoardingResponse } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { AccountIntegrationRequiredError } from '../lib/accountIntegrationError';
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

    throw handleApiError(error, '회원가입에 실패했습니다.');
  }
}
