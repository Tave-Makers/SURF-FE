import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { IntegrationTargetApiResponse } from './types';
import { mapIntegrationTarget } from '../model/mappers';
import type { IntegrationTarget } from '../model/types';

/**
 * 온보딩 중 감지된 통합 대상(기존 계정)의 프로필과 연결된 소셜 로그인 수단을 조회한다.
 *
 * `REGISTERING` 상태 임시 회원의 Access Token으로만 호출 가능하며,
 * 통합 대기 정보가 없거나 만료된 경우 404 / 410 으로 실패한다.
 */
export async function getIntegrationTarget(): Promise<IntegrationTarget> {
  const res = await axiosInstance.get<IntegrationTargetApiResponse>(
    'v1/user/social-accounts/integrate/target',
  );

  return mapIntegrationTarget(res.data.data);
}
