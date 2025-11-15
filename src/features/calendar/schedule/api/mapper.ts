import type { ScheduleFormData } from '../model/types';
import type { ScheduleCreateRequest } from '@/entities/schedule/model/types';

export function mapScheduleFormToRequest(form: ScheduleFormData): ScheduleCreateRequest {
  return {
    category: form.category,
    title: form.title,
    content: form.content,
    startAt: form.startDate.toISOString(),
    endAt: form.endDate.toISOString(),
    location: form.location || undefined,
  };
}
