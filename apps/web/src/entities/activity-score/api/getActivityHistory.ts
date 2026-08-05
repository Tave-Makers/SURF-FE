import { ActivityHistoryResponse } from '../model/types';
import { ScoreMode } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const getActivityHistory = async (
  scoreType: ScoreMode,
  pageSize: number,
  pageParam: number,
): Promise<ActivityHistoryResponse['data']> => {
  try {
    const response = await axiosInstance.get<ActivityHistoryResponse>(
      '/v1/user/members/activity-records',
      {
        params: {
          scoreType,
          pageSize,
          pageNum: pageParam,
        },
      },
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching activity history:', error);
    throw error;
  }
};
