import { ScheduleCreateRequest, ScheduleCreateResponse } from '@/entities/schedule/model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function createPostSchedule(
  postId: number,
  data: ScheduleCreateRequest,
): Promise<ScheduleCreateResponse> {
  const res = await axiosInstance.post<ScheduleCreateResponse>(
    `/v1/admin/posts/${postId}/schedules`,
    data,
  );
  return res.data;
}
