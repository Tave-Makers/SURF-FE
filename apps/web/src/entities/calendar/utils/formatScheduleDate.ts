import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 일정 날짜(시작일/종료일) 포맷팅 함수
 */

export const formatScheduleDate = (date: Date | null | undefined): string => {
  if (!date) {
    return '미정';
  }

  try {
    return format(date, 'MM월 dd일 (eee) HH:mm', { locale: ko });
  } catch {
    return '미정';
  }
};
