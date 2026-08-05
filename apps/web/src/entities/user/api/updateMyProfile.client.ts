import type { UpdateProfileRequestDTO } from '@/entities/user/model/types';
import type { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function updateMyProfile(
  payload: UpdateProfileRequestDTO,
  signal?: AbortSignal,
): Promise<CommonResponse<null>> {
  const res = await axiosInstance.patch<CommonResponse<null>>(
    '/v1/user/members/profile/update',
    payload,
    { signal },
  );
  return res.data;
}
