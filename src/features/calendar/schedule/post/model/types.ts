import { ScheduleCategory } from '@/entities/schedule/model/types';

export type ScheduleFormData = {
  category: ScheduleCategory;
  title: string;
  content?: string;
  startDate: Date;
  endDate: Date;
  location?: string;
};
