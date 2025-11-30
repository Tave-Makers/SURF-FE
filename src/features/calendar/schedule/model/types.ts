import { ScheduleCategory } from '@/entities/schedule/model/types';

export type ScheduleFormData = {
  category: ScheduleCategory;
  title: string;
  content: string; // 기획측에 확인 필요
  startDate: Date;
  endDate: Date;
  location?: string;
};
