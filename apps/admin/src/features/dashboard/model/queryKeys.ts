import type { DashboardDateRangeParams } from '../api/types';

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  detail: (params: DashboardDateRangeParams) =>
    [...dashboardQueryKeys.all, params.startDate ?? '', params.endDate ?? ''] as const,
};
