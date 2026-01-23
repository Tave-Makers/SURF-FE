import { axiosInstance } from '@/shared/lib/axiosInstance';
import { SingleScheduleResponse, SingleSchedule } from './types';
import { getValidCategory } from '@/entities/schedule/model/constants';

export const getSingleSchedule = async (scheduleId: number): Promise<SingleSchedule> => {
  try {
    const response = await axiosInstance.get<SingleScheduleResponse>(
      `/v1/admin/calendar/schedules/${scheduleId}`,
    );

    const rawData = response.data.data;

    // 서버 데이터를 신뢰할 수 있는 데이터로 변환하여 반환
    return {
      ...rawData,
      category: getValidCategory(rawData.category),
    };
  } catch (error) {
    // 에러 발생 시 콘솔에 상세 내용을 찍고 에러를 다시 던집니다.
    console.error(`Error fetching single schedule (ID: ${scheduleId}):`, error);
    throw error;
  }
};
