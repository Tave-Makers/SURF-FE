import { axiosInstance } from '@/shared/lib/axiosInstance';
import { SignupRequestListResponse, SignupRequestListParams } from './types';
import { createMockSignupRequestList } from './mockData';

// 목업 모드 활성화 여부
const USE_MOCK = true;

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
  // 목업 모드
  if (USE_MOCK) {
    // 네트워크 지연 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 500));
    return createMockSignupRequestList(params.pageNum, params.pageSize, params.keyword);
  }

  // 실제 API 호출
  const response = await axiosInstance.get<SignupRequestListResponse>(
    '/v1/manager/registration-list',
    {
      params,
    },
  );

  return response.data;
}
