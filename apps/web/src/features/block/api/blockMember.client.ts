import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { BlockMemberRequest, BlockMemberResponse, BlockedMemberDTO } from './types';

/** 회원 차단 등록 — 본인 400, 없거나 탈퇴한 회원 404, 이미 차단한 회원 409 */
export async function blockMember(request: BlockMemberRequest): Promise<BlockedMemberDTO> {
  const res = await axiosInstance.post<BlockMemberResponse>('/v1/user/blocks', request);
  return res.data.data;
}
