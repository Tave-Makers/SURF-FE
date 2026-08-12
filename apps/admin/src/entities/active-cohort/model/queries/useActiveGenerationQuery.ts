'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { getActiveGeneration } from '../../api/getActiveGeneration';
import { toActiveCohort } from '../mappers';
import type { ActiveCohort } from '../types';
import { activeGenerationQueryKeys } from './activeGenerationQueryKeys';

export function useActiveGenerationQuery() {
  const showToast = useToastStore((s) => s.show);

  const query = useQuery<ActiveCohort>({
    queryKey: activeGenerationQueryKeys.current(),
    queryFn: async () => {
      const response = await getActiveGeneration();
      return toActiveCohort(response.data);
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (query.isError) {
      console.error('[Active Generation Query Error]', query.error?.message);
      showToast('활동기수 조회에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  }, [query.isError, query.error, showToast]);

  return query;
}
