import { CommonResponse } from '@/shared/api/types';

// 일정 수정 Request type
export type EditScheduleRequest = {
  category: string;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  location: string;
};

// 일정 수정 Response type
export type EditScheduleResponse = CommonResponse<void>;
