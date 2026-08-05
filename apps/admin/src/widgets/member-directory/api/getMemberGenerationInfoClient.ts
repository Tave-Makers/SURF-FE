import { AdminTotalMemberListResDTO, MemberGenerationInfoResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

/**
 * 전체 회원수 + 기수 리스트 조회 API
 *
 * @returns 전체 회원수 + 기수 목록 응답
 */
export async function getMemberGenerationInfoClient(): Promise<AdminTotalMemberListResDTO> {
  const response = await axiosInstance.get<MemberGenerationInfoResponse>('/v1/user/generations');

  return response.data.data;
}
