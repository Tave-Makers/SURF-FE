import { GroupListParams } from '@/features/group-management/model/queries/useGroupListQuery';

export const groupQueryKeys = {
  all: ['groups'] as const,

  lists: () => [...groupQueryKeys.all, 'list'] as const,
  list: (params?: GroupListParams) => [...groupQueryKeys.lists(), params ?? null] as const,

  details: () => [...groupQueryKeys.all, 'detail'] as const,
  detail: (teamId: number) => [...groupQueryKeys.details(), teamId] as const,

  detailDisabled: () => [...groupQueryKeys.details(), null] as const,
};
