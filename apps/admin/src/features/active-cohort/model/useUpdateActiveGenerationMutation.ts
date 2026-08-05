'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateActiveGeneration } from '@/entities/active-cohort/api/updateActiveGeneration';
import { activeGenerationQueryKeys } from '@/entities/active-cohort/model/queries/activeGenerationQueryKeys';

export function useUpdateActiveGenerationMutation() {
  const qc = useQueryClient();
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: (generation: number) => updateActiveGeneration({ activeGeneration: generation }),
    onSuccess: () => {
      showToast('활동기수가 설정되었습니다.');
      void qc.invalidateQueries({ queryKey: activeGenerationQueryKeys.all });
    },
    onError: (err) => {
      console.error('[Active Generation Update Error]', err.message);
      showToast('활동기수 변경에 실패했습니다. 다시 시도해 주세요.');
    },
  });
}
