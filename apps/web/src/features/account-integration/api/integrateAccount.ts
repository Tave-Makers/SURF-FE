import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { SocialAccountIntegrateApiResponse, SocialAccountIntegrateReqDTO } from './types';

/**
 * 1회성 통합 토큰으로 계정 통합을 실행한다.
 */
export async function integrateAccount(body: SocialAccountIntegrateReqDTO) {
  const res = await axiosInstance.post<SocialAccountIntegrateApiResponse>(
    'v1/user/social-accounts/integrate',
    body,
  );

  return res.data;
}
