import 'server-only';
import { MemberGenerationInfoResponse, AdminTotalMemberListResDTO } from './types';
import { serverFetchWithCookies } from '@/shared/api/serverFetchWithCookies';

/**
 * 전체 회원수 + 기수 리스트 조회 API(Server Component 전용)
 *
 * @returns 전체 회원수 + 기수 목록 응답
 */
export async function getMemberGenerationInfoServer(): Promise<AdminTotalMemberListResDTO> {
  const response =
    await serverFetchWithCookies<MemberGenerationInfoResponse>('/v1/user/generations');

  return response.data;
}
