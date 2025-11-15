import {
  CalendarScheduleRequest,
  CalendarScheduleResponse,
  FullApiResponseResponse,
} from '@/features/calendar/model/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getCalendarSchedule(
  params: CalendarScheduleRequest,
): Promise<CalendarScheduleResponse> {
  try {
    const response = await axiosInstance.get<FullApiResponseResponse>(
      '/v1/user/calendar/schedules',
      {
        params: params,
      },
    );
    console.log('캘린더 일정 불러오기 요청 성공');
    return response.data.data;
  } catch (error) {
    console.log('캘린더 일정 불러오기 요청 실패:', error);
    throw error;
  }
}
