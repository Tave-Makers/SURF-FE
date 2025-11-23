import { axiosInstance } from '@/shared/lib/axiosInstance';
import { EditScheduleRequest, EditScheduleResponse } from './types';

export const editSchedule = async (
  scheduleId: number,
  data: EditScheduleRequest,
): Promise<EditScheduleResponse['data']> => {
  const response = await axiosInstance.patch<EditScheduleResponse>(
    `/v1/admin/schedules/${scheduleId}`,
    data,
  );
  return response.data.data;
};
