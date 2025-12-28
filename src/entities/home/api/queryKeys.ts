export const homeQueryKeys = {
  all: ['home'] as const,

  home: () => [...homeQueryKeys.all, 'home'] as const,
};
