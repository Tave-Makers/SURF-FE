export const POST_VALIDATION = {
  MAX_TITLE_LENGTH: 50,
  MAX_CONTENT_LENGTH: 100000,
  MAX_IMAGES: 10,
} as const;

export type PostValidationRule = typeof POST_VALIDATION;
