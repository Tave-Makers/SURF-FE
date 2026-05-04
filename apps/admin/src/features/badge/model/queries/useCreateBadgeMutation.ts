import { useMutation } from '@tanstack/react-query';
import { createBadge } from '@/features/badge/api/createBadge';

import { mapCreateBadgeInputToRequest } from '@/features/badge/model/mapper';

import { CreateBadgeInput } from '../types';

export const useCreateBadgeMutation = () => {
  return useMutation({
    mutationFn: (data: CreateBadgeInput) => createBadge(mapCreateBadgeInputToRequest(data)),
    onError: (error) => {
      console.error('[useCreateBadgeMutation] 배지 생성 실패:', error);
    },
  });
};
