export const scheduleQueryKeys = {
  all: ['schedules'] as const,

  calendarScheduleLists: () => [...scheduleQueryKeys.all, 'calendarList'] as const,
  calendarScheduleList: (year: number, month: number) =>
    [...scheduleQueryKeys.calendarScheduleLists(), year, month] as const,

  postScheduleDetail: (postId: number) => [...scheduleQueryKeys.all, 'detail', postId] as const,

  scheduleDetail: (scheduleId: number) => [...scheduleQueryKeys.all, 'detail', scheduleId] as const,
};
