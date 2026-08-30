export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (category?: string | null) => [...notificationKeys.lists(), category ?? null] as const,
  unreadCheck: () => [...notificationKeys.all, 'unreadCheck'] as const,
};
