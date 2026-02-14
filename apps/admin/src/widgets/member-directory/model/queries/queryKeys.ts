export const memberGenerationKeys = {
  all: ['member-generation'] as const,
  lists: () => [...memberGenerationKeys.all, 'list'],
};
