import { ActivitySummaryResponse } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const getActivitySummary = async (): Promise<ActivitySummaryResponse['data']> => {
  try {
    const response = await axiosInstance.get<ActivitySummaryResponse>(
      `/v1/user/members/personal-score/pinned5`,
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching activity summary:', error);
    throw error;
  }
};
