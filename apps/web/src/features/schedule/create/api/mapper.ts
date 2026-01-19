import type { ScheduleFormData } from '../model/types';
import type { ScheduleCreateRequest } from '@/entities/schedule/model/types';

export function toFormLocation(location: string | null | undefined): string {
  return location === '미정' ? '' : (location ?? '');
}

export function toServerLocation(location: string | null | undefined): string {
  if (!location || location.trim() === '') {
    return '미정';
  }
  return location;
}

export function mapScheduleFormToRequest(form: ScheduleFormData): ScheduleCreateRequest {
  return {
    category: form.category,
    title: form.title,
    startAt: form.startDate.toISOString(),
    endAt: form.endDate.toISOString(),
    location: toServerLocation(form.location),
  };
}
