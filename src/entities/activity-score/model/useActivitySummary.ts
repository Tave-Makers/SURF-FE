import { useQuery } from '@tanstack/react-query';
import { getActivitySummary } from '../api/getActivitySummary';
import type { ActivitySummaryResponse } from './types';

export const useActivitySummary = () =>
  useQuery<ActivitySummaryResponse['data']>({
    queryKey: ['activity-summary'] as const,
    queryFn: () => getActivitySummary(),
    enabled: true,
  });
