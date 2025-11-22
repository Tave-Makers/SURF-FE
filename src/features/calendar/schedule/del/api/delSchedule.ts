import { axiosInstance } from '@/shared/lib/axiosInstance';
import { DelScheduleResponse } from './types';

export const delSchedule = async (scheduleId: number): Promise<DelScheduleResponse> => {
  const response = await axiosInstance.delete<DelScheduleResponse>(
    `/v1/admin/schedules/${scheduleId}`,
  );
  return response.data;
};
