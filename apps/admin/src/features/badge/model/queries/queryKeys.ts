export const badgeQueryKeys = {
  all: ['badges'] as const,
  list: () => [...badgeQueryKeys.all, 'list'] as const,
};
