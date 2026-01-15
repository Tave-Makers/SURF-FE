import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { BadgeApiResponse } from './types';

export type GetBadgesParams = {
  pageNum: number;
  pageSize?: number;
  memberId?: number; // 없으면 내 뱃지
};

export async function getBadges(params: GetBadgesParams): Promise<BadgeApiResponse> {
  const { memberId, pageNum, pageSize = 9 } = params; // 임시 고정

  const res = await axiosInstance.get<BadgeApiResponse>('/v1/user/members/badges', {
    params: {
      pageNum,
      pageSize,
      ...(memberId != null ? { memberId } : {}),
    },
  });

  return res.data;
}
