import { ActivitySummaryResponse } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const getActivitySummary = async (
  memberId: number,
): Promise<ActivitySummaryResponse['data']> => {
  try {
    const response = await axiosInstance.get<ActivitySummaryResponse>(
      `/v1/user/members/${memberId}/personal-score/pinned5`,
    );
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    throw error;
  }
};
