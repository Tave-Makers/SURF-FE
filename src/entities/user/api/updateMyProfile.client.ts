import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { UpdateProfileRequestDTO } from '@/entities/user/model/types';

export async function updateMyProfile(payload: UpdateProfileRequestDTO): Promise<unknown> {
  const res = await axiosInstance.patch('/v1/user/members/profile/update', payload);
  return res.data;
}
