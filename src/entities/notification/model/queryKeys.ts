export const notificationKeys = {
  all: ['notifications'] as const,
  list: (category?: string) => [...notificationKeys.all, 'list', category] as const,
};
