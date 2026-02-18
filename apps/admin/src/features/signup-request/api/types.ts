import { ApiTrack } from '@/entities/member/api/types';
import { MemberRole } from '@/entities/member/model/types';
import { CommonResponse, PageMeta } from '@/shared/api/types';

/**
 * 가입 신청 아이템
 */
export interface SignupRequestItem {
  memberId: number;
  username: string;
  university: string;
  profileImageUrl: string;
  trackList: ApiTrack[];
  createdAt: string;
  memberStatus: string;
  role: MemberRole;
}

/**
 * 가입 신청 목록 데이터
 */
export interface SignupRequestListData extends PageMeta {
  content: SignupRequestItem[];
  totalMemberCount: number;
}

/**
 * 가입 신청 목록 조회 응답
 */
export type SignupRequestListResponse = CommonResponse<SignupRequestListData>;

/**
 * 가입 신청 목록 조회 요청 파라미터
 */
export interface SignupRequestListParams {
  keyword?: string;
  pageNum: number;
  pageSize: number;
}
