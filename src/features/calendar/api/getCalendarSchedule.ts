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
    if (process.env.NODE_ENV === 'development') {
      console.log('캘린더 일정 불러오기 요청 성공', response.data);
    }
    return response.data.data;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('캘린더 일정 불러오기 요청 실패:', error);
    }
    throw error;
  }
}
