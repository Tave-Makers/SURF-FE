import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '../api/getDashboard';
import type { DashboardDateRangeParams } from '../api/types';
import { dashboardQueryKeys } from './queryKeys';

export function useDashboardQuery(params: DashboardDateRangeParams) {
  return useQuery({
    queryKey: dashboardQueryKeys.detail(params),
    queryFn: () => getDashboard(params),
  });
}
