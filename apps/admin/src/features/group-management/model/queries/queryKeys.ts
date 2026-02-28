import { ContentsType } from '@/shared/types/contents';

export const groupQueryKeys = {
  all: ['groups'] as const,

  lists: () => [...groupQueryKeys.all, 'list'] as const,
  list: (type?: ContentsType) => [...groupQueryKeys.lists(), type ?? null] as const,

  details: () => [...groupQueryKeys.all, 'detail'] as const,
  detail: (teamId: number) => [...groupQueryKeys.details(), teamId] as const,

  detailDisabled: () => [...groupQueryKeys.details(), null] as const,
};
