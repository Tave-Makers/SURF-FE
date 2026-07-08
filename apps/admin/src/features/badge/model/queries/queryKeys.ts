export const badgeQueryKeys = {
  all: ['badges'] as const,
  list: () => [...badgeQueryKeys.all, 'list'] as const,
  details: () => [...badgeQueryKeys.all, 'detail'] as const,
  detail: (badgeId: number) => [...badgeQueryKeys.details(), badgeId] as const,
  members: (badgeId: number) => [...badgeQueryKeys.detail(badgeId), 'members'] as const,
};
