import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { UnblockMemberResponse } from './types';

/**
 * 회원 차단 해제
 *
 * @param memberId 차단당한 회원 ID (block_id가 아님). 해당 방향의 차단이 없으면 404
 */
export async function unblockMember(memberId: number): Promise<void> {
  await axiosInstance.delete<UnblockMemberResponse>(`/v1/user/blocks/${memberId}`);
}
