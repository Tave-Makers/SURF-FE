import type { CommonResponse } from '@/shared/api/types';

/** 차단 회원 정보 — 차단 등록 응답 / 목록 아이템 공통 스키마 */
export interface BlockedMemberDTO {
  memberId: number;
  name: string;
  profileImageUrl: string | null;
  blockedAt: string;
}

/** 차단 등록 요청 — POST /v1/user/blocks */
export interface BlockMemberRequest {
  memberId: number;
}

export type BlockMemberResponse = CommonResponse<BlockedMemberDTO>;

/** 차단 목록 슬라이스 — GET /v1/user/blocks (최신순, 나를 차단한 회원은 제외) */
export interface BlockedMemberSlice {
  content: BlockedMemberDTO[];
  pageNumber: number;
  pageSize: number;
  hasNext: boolean;
}

export type BlockedMemberListResponse = CommonResponse<BlockedMemberSlice>;

/** 차단 해제 — DELETE /v1/user/blocks/{userId} */
export type UnblockMemberResponse = CommonResponse<null>;
