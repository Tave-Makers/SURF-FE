export const scheduleQueryKeys = {
  all: ['calendar-schedule'] as const,

  scheduleLists: () => [...scheduleQueryKeys.all, 'list'] as const,
  scheduleList: (year: number, month: number) =>
    [...scheduleQueryKeys.scheduleLists(), year, month] as const,

  detail: (scheduleId: number) => [...scheduleQueryKeys.all, 'detail', scheduleId] as const,
};
