import type { ScheduleFormData } from '../model/types';
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
    category: categoryToLabel(form.category),
    title: form.title,
    content: form.content || '',
    startAt: form.startDate.toISOString(),
    endAt: form.endDate.toISOString(),
    location: form.location || '미정',
  };
}
