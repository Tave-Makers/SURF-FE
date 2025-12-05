import { axiosInstance } from '@/shared/lib/axiosInstance';
import { SingleScheduleResponse, SingleSchedule } from './types';

export const getSingleSchedule = async (scheduleId: number): Promise<SingleSchedule> => {
  const response = await axiosInstance.get<SingleScheduleResponse>(
    `/v1/admin/calendar/schedules/${scheduleId}`,
  );
  // TODO: 로그 삭제 예정
  console.log('getSingleSchedule response:', response);

  return response.data.data;
};
