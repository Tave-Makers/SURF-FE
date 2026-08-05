import 'server-only';
import { SignupRequestListResponse, SignupRequestListParams, SignupRequestListData } from './types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';

/**
 * 가입 신청 목록 조회 API (Server Component 전용)
 *
 * @param params - 페이지네이션 파라미터
 * @returns 가입 신청 목록 응답
 */
export async function getSignupRequestListServer(
  params: SignupRequestListParams,
): Promise<SignupRequestListData> {
  const searchParams = new URLSearchParams();
  searchParams.set('pageNum', String(params.pageNum));
  searchParams.set('pageSize', String(params.pageSize));
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  const queryString = searchParams.toString();
  const res = await serverFetchWithCookies<SignupRequestListResponse>(
    `/v1/manager/registration-list?${queryString}`,
  );
  return res.data;
}
