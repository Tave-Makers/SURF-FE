import { axiosInstance } from '@/shared/lib/axiosInstance';
import { GenerationListResDTO, GenerationListResponse } from './types';

/**
 * 전체 회원수 + 기수 리스트 조회 API
 *
 * @returns 전체 회원수 + 기수 목록 응답
 */
export async function getGenerationList(): Promise<GenerationListResDTO> {
  const response = await axiosInstance.get<GenerationListResponse>('/v1/user/generations');

  return response.data.data;
}
