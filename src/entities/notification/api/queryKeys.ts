export const NOTIFICATION_KEYS = {
  all: ['notifications'] as const,
  list: (category?: string) => [...NOTIFICATION_KEYS.all, 'list', category] as const,
};
