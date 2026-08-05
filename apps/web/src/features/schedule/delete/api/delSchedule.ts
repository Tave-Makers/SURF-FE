import { DelScheduleResponse } from './types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export const delSchedule = async (scheduleId: number): Promise<DelScheduleResponse['data']> => {
  const response = await axiosInstance.delete<DelScheduleResponse>(
    `/v1/admin/schedules/${scheduleId}`,
  );
  return response.data.data;
};
