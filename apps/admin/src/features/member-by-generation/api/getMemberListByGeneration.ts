import { axiosInstance } from '@/shared/lib/axiosInstance';
import { MemberListDTO, MemberListResponse } from './types';

/**
 * 멤버 목록 조회 요청 파라미터
 */
export interface MemberListParams {
  generation: number;
  keyword?: string;
  pageNum: number;
  pageSize: number;
}

/**
 * 기수별 승인 멤버 목록을 페이지 단위로 조회합니다.
 *
 * @param params - 목록 조회 요청 파라미터
 * @param params.generation - 조회할 기수
 * @param params.keyword - 이름  검색 키워드 (선택)
 * @param params.pageNum - 0부터 시작하는 페이지 번호
 * @param params.pageSize - 페이지당 항목 수
 * @returns 페이지 메타 정보와 멤버 목록이 포함된 DTO
 */
export async function getMemberListByGeneration(params: MemberListParams): Promise<MemberListDTO> {
  const response = await axiosInstance.get<MemberListResponse>('/v1/manager/approved-members', {
    params,
  });

  return response.data.data;
}
