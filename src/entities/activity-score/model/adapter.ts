import { ActivityHistoryRaw, ActivityHistory } from './types';

export const toActivityHistory = (raw: ActivityHistoryRaw): ActivityHistory => ({
  memberId: raw.memberId,
  date: raw.activityDate,
  category: raw.categoryName,
  activity: raw.activityName ?? undefined,
  delta: raw.appliedScore,
  total: raw.prefixSum,
});
