import { CommonResponse } from '@/shared/api/types';

// 캘린더 일정 조회 params 타입
export type CalendarScheduleRequest = {
  year: number;
  month: number;
};

// 단일 일정 타입
export type scheduleResDTO = {
  scheduleId: number;
  category: string;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  location: string;
  mappedByPost: boolean;
  postId: number;
};

// 캘린더 일정 조회 data 타입
export type CalendarScheduleResponse = {
  year: number;
  month: number;
  scheduleResDTOList: scheduleResDTO[];
};

export type FullApiResponseResponse = CommonResponse<CalendarScheduleResponse>;
