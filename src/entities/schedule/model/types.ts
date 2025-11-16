import { CommonResponse } from '@/shared/api/types';

// 일정 타입
export type ScheduleCategory = 'regular' | 'operation' | 'other';

// 일정 생성 Request 타입
export type ScheduleCreateRequest = {
  category: string;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  location?: string;
};

// 일정 생성 Response 타입
export type ScheduleCreateResponse = {
  data: [];
};

// 일정 생성 최종 응답 타입
export type FullApiResponse = CommonResponse<ScheduleCreateResponse>;
