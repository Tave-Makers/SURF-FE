import type { TeamKind } from '../types';

export const teamQueryKeys = {
  all: ['team'] as const,

  lists: () => [...teamQueryKeys.all, 'list'] as const,
  list: (params: { kind?: TeamKind; generation?: number }) =>
    [...teamQueryKeys.lists(), params.kind ?? null, params.generation ?? null] as const,

  details: () => [...teamQueryKeys.all, 'detail'] as const,
  detail: (teamId: number) => [...teamQueryKeys.details(), teamId] as const,
};
