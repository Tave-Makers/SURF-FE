export const bannerQueryKeys = {
  all: ['banner'] as const,
  list: () => [...bannerQueryKeys.all, 'list'] as const,
};
