import { ActivityHistoryResponse } from '../model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import { ScoreMode } from '../model/types';

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
    console.log(response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching activity history:', error);
    throw error;
  }
};
