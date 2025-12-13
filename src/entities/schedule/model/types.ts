// 일정 타입
export type ScheduleCategory = 'regular' | 'operation' | 'other';

// 캘린더에서 일정 생성 Request 타입
export type ScheduleCreateRequest = {
  category: ScheduleCategory;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
};

// 캘린더에서 일정 생성 Response 타입
export type ScheduleCreateResponse = {
  data: [];
};
