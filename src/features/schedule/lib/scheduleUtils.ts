import { ScheduleFormData } from '@/features/schedule/create/model/types';

/**
 * 두 일정 데이터가 같은지 비교 (ID, 내용, 시간)
 * storeData가 null이면 다르다고 판단
 */
export const isSameSchedule = (
  storeData: ScheduleFormData | null,
  serverData: ScheduleFormData,
): boolean => {
  if (!storeData) return false;

  // 1. ID 비교
  if (storeData.id !== serverData.id) return false;

  // 2. 텍스트 데이터 비교
  if (storeData.title !== serverData.title) return false;
  if (storeData.category !== serverData.category) return false;
  if (storeData.location !== serverData.location) return false;

  // 3. 날짜 비교 (getTime)
  const storeStart = new Date(storeData.startDate).getTime();
  const serverStart = new Date(serverData.startDate).getTime();
  if (storeStart !== serverStart) return false;

  const storeEnd = new Date(storeData.endDate).getTime();
  const serverEnd = new Date(serverData.endDate).getTime();
  if (storeEnd !== serverEnd) return false;

  return true;
};
