import { CommonResponse } from '@/shared/api/types';

// 일정 수정 Request body type
export type EditScheduleRequest = {
  category: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
};

// 일정 수정 Response type
export type EditScheduleResponse = CommonResponse<void>;

// 일정 단건 type
export type SingleSchedule = {
  scheduleId: number;
  category: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  mappedByPost: boolean;
  postId: number;
};

// 일정 단건 조회 Response type
export type SingleScheduleResponse = CommonResponse<SingleSchedule>;
