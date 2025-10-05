import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { UserProfileApiResponse, BadgeApiResponse } from './types';
import type { UpdateProfileRequestDTO } from '@/entities/user/model/types';

export async function getMyProfile() {
  const res = await axiosInstance.get<UserProfileApiResponse>('/v1/user/members/profile');
  return res.data;
}

export async function updateMyProfile(payload: UpdateProfileRequestDTO): Promise<unknown> {
  const res = await axiosInstance.patch('/v1/user/members/profile', payload);
  return res.data;
} // 임시

export async function getMemberBadges(params: {
  memberId?: number;
  pageNum: number; // 페이지 번호
  pageSize?: number; // 한 번에 받는 뱃지 갯수 (현재 9개 고정)
}): Promise<BadgeApiResponse> {
  const { memberId, pageNum, pageSize = 9 } = params;
  const queryParams: Record<string, number> = { pageSize, pageNum };
  if (memberId) {
    queryParams.memberId = memberId;
  }

  const res = await axiosInstance.get<BadgeApiResponse>('/v1/user/members/badges', {
    params: queryParams,
  });
  return res.data;
}
