import { axiosInstance } from '@/shared/lib/axiosInstance';
import { AdminTotalMemberListResDTO, MemberGenerationInfoResponse } from './types';

/**
 * 전체 회원수 + 기수 리스트 조회 API
 *
 * @returns 전체 회원수 + 기수 목록 응답
 */
export async function getMemberGenerationInfoClient(): Promise<AdminTotalMemberListResDTO> {
  const response = await axiosInstance.get<MemberGenerationInfoResponse>('/v1/manager/generations');

  return response.data.data;
}
