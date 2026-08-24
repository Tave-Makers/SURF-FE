import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { BlockedMemberListResponse, BlockedMemberSlice } from './types';

export const BLOCKED_MEMBERS_DEFAULT_PAGE = 0;
export const BLOCKED_MEMBERS_PAGE_SIZE = 20;

/** 내가 차단한 회원 목록 조회 (최신순) */
export async function fetchBlockedMembers(
  page: number = BLOCKED_MEMBERS_DEFAULT_PAGE,
  size: number = BLOCKED_MEMBERS_PAGE_SIZE,
): Promise<BlockedMemberSlice> {
  const res = await axiosInstance.get<BlockedMemberListResponse>('/v1/user/blocks', {
    params: { page, size },
  });
  return res.data.data;
}
