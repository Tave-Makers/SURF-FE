import { SignupRequestStatus } from '@/entities/signup-request/model/types';
import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function updateSignupRequest(
  memberIds: number[],
  nextStatus: SignupRequestStatus,
): Promise<CommonResponse<null>> {
  try {
    const response = await axiosInstance.patch<CommonResponse<null>>(
      `/v1/admin/members/${nextStatus}`,
      memberIds,
    );

    return response.data;
  } catch (error) {
    throw handleApiError(
      error,
      `회원 가입${nextStatus === 'approve' ? '승인' : '거절'}에 실패했습니다.`,
    );
  }
}
