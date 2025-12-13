import { ScheduleCategory } from '@/entities/schedule/model/types';

export type ScheduleFormData = {
  id?: number;
  category: ScheduleCategory;
  title: string;
  startDate: Date;
  endDate: Date;
  location?: string;
};
