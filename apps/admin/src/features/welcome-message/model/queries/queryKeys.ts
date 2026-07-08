export const welcomeMessageQueryKeys = {
  all: ['homeContent'] as const,
  detail: () => [...welcomeMessageQueryKeys.all, 'detail'] as const,
};
