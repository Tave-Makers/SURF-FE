import type { ScheduleFormData } from '../model/types';
import type { ScheduleCategory } from '@/entities/schedule/model/types';
import type { ScheduleCreateRequest } from '@/entities/schedule/model/types';

function categoryToLabel(category: string): string {
  switch (category) {
    case 'regular':
      return '정규행사';
    case 'operation':
      return '운영회의';
    case 'other':
      return '기타일정';
    default:
      return '정규행사';
  }
}

export function mapScheduleFormToRequest(form: ScheduleFormData): ScheduleCreateRequest {
  return {
    category: categoryToLabel(form.category) as ScheduleCategory,
    title: form.title,
    startAt: form.startDate.toISOString(),
    endAt: form.endDate.toISOString(),
    location: form.location || '',
  };
}
