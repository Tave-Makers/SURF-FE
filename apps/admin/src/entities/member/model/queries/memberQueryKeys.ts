export const memberQueryKeys = {
  all: ['member'] as const,
  detail: (memberId: string) => [...memberQueryKeys.all, 'detail', memberId] as const,
};
