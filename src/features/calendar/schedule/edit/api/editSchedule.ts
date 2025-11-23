import { axiosInstance } from '@/shared/lib/axiosInstance';
import { EditScheduleResponse } from './types';

export const editSchedule = async (scheduleId: number): Promise<EditScheduleResponse['data']> => {
  const response = await axiosInstance.patch<EditScheduleResponse>(
    `/v1/admin/schedules/${scheduleId}`,
  );
  return response.data.data;
};
