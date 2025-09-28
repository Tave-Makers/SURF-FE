import { useQuery } from '@tanstack/react-query';
import { getActivitySummary } from '../api/getActivitySummary';
import type { ActivitySummaryResponse } from './types';

export const useActivitySummary = (memberId: number) =>
  useQuery<ActivitySummaryResponse['data']>({
    queryKey: ['activity-summary', memberId] as const,
    queryFn: () => getActivitySummary(memberId),
    enabled: Boolean(memberId),
    staleTime: 60 * 1000,
  });
