import { getInitialTime } from './getInitialTime';

export const getSafeDate = (date?: Date | string | null): Date => {
  if (!date) return getInitialTime(); // 값이 없으면 00분 or 30분으로 맞춘 현재 시간
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime()) ? parsedDate : getInitialTime();
};
