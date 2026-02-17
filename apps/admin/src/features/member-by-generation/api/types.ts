import { MemberItem } from '@/entities/member/api/types';
import { CommonResponse, PageMeta } from '@/shared/api/types';

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
 * 가입 신청 목록 데이터
 */
export interface MemberListDTO extends PageMeta {
  content: MemberItem[];
}

export type MemberListResponse = CommonResponse<MemberListDTO>;
