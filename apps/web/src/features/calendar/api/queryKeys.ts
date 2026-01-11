export const scheduleQueryKeys = {
  all: ['schedule'] as const,

  /* --------------------
   * Lists (목록 계열)
   * -------------------- */
  lists: () => [...scheduleQueryKeys.all, 'list'] as const,

  /**
   * 캘린더 / 전체 일정 목록
   * - year, month가 있으면 월별
   * - 없으면 전체
   */
  list: (params?: { year?: number; month?: number }) =>
    [...scheduleQueryKeys.lists(), params] as const,

  /* --------------------
   * Details (단건 계열)
   * -------------------- */
  details: () => [...scheduleQueryKeys.all, 'detail'] as const,

  /**
   * 단일 일정
   */
  detail: (scheduleId: number) => [...scheduleQueryKeys.details(), scheduleId] as const,
};
