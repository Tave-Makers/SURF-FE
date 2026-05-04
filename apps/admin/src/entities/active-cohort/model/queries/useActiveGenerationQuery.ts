'use client';

import { useQuery } from '@tanstack/react-query';
import { getActiveGeneration } from '../../api/getActiveGeneration';
import { toActiveCohort } from '../mappers';
import type { ActiveCohort } from '../types';
import { activeGenerationQueryKeys } from './activeGenerationQueryKeys';

export function useActiveGenerationQuery() {
  return useQuery<ActiveCohort>({
    queryKey: activeGenerationQueryKeys.current(),
    queryFn: async () => {
      const response = await getActiveGeneration();
      return toActiveCohort(response.data);
    },
  });
}
