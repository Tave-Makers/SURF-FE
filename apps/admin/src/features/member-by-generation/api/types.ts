import { MemberItem } from '@/entities/member/api/types';
import { CommonResponse, PageMeta } from '@/shared/api/types';

/**
 * 가입 신청 목록 데이터
 */
export interface MemberListDTO extends PageMeta {
  content: MemberItem[];
}

export type MemberListResponse = CommonResponse<MemberListDTO>;
