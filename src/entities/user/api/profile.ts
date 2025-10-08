import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { UserProfileApiResponse } from './types';
import type { UpdateProfileRequestDTO } from '@/entities/user/model/types';

export async function getMyProfile() {
  const res = await axiosInstance.get<UserProfileApiResponse>('/v1/user/members/profile');
  return res.data;
}

export async function updateMyProfile(payload: UpdateProfileRequestDTO): Promise<unknown> {
  const res = await axiosInstance.patch('/v1/user/members/profile', payload);
  return res.data;
} // 임시
