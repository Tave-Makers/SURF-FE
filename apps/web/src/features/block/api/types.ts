import type { CommonResponse } from '@/shared/api/types';

/**
 * 회원 차단 요청
 *
 * TODO: 백엔드 차단 API 스펙 확정 후 실제 DTO에 맞게 수정
 * (엔드포인트 / 필드명 미확정 상태)
 */
export type BlockMemberRequest = {
  targetMemberId: number;
};

export type BlockMemberResponse = CommonResponse<null>;
