import { axiosInstance } from '@/shared/lib/axiosInstance';
import { SignupRequestListResponse, SignupRequestListParams } from './types';

/**
 * 가입 신청 목록 조회 API
 *
 * @param params - 페이지네이션 파라미터
 * @returns 가입 신청 목록 응답
 *
 */
export async function getSignupRequestList(
  params: SignupRequestListParams,
): Promise<SignupRequestListResponse> {
  const response = await axiosInstance.get<SignupRequestListResponse>(
    '/v1/manager/registration-list',
    {
      params,
    },
  );

  return response.data;
}
