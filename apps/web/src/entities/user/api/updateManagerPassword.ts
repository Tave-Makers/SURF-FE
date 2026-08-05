import type { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function updateManagerPassword(password: string): Promise<CommonResponse<null>> {
  try {
    const res = await axiosInstance.patch<CommonResponse<null>>('/v1/manager/password', {
      password,
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error, '비밀번호 설정에 실패했습니다.');
  }
}
