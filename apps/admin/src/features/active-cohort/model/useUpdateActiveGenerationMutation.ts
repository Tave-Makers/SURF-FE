'use client';

import { updateActiveGeneration } from '@/entities/active-cohort/api/updateActiveGeneration';
import { activeGenerationQueryKeys } from '@/entities/active-cohort/model/queries/activeGenerationQueryKeys';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useUpdateActiveGenerationMutation() {
  const qc = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: (generation: number) => updateActiveGeneration({ activeGeneration: generation }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: activeGenerationQueryKeys.all });
    },
    onError: (err) => {
      console.error('[Active Generation Update Error]', err.message);
      showToast('활동기수 변경에 실패했습니다. 다시 시도해 주세요.');
    },
  });
}
