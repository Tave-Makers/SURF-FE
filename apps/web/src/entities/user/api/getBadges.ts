import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { BadgeApiResponse } from './types';

export type GetBadgesParams = {
  memberId: number;
};

export async function getBadges(params: GetBadgesParams): Promise<BadgeApiResponse> {
  const { memberId } = params;

  const res = await axiosInstance.get<BadgeApiResponse>(`/v1/user/members/${memberId}/badges`);

  return res.data;
}
