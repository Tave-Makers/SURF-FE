export const activeGenerationQueryKeys = {
  all: ['activeGeneration'] as const,
  current: () => [...activeGenerationQueryKeys.all, 'current'] as const,
};
