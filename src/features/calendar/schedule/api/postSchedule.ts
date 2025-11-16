import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function postSchedule(data: ScheduleCreateRequest): Promise<ScheduleCreateResponse> {
  const res = await axiosInstance.post<ScheduleCreateResponse>(
    '/v1/admin/calendar/schedules',
    data,
  );
  return res.data;
}
