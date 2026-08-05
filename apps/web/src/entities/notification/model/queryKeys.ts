export const notificationKeys = {
  all: ['notifications'] as const,
  list: (category?: string | null) => [...notificationKeys.all, 'list', category ?? null] as const,
  unreadCheck: () => [...notificationKeys.all, 'unreadCheck'] as const,
};
