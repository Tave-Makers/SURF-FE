export const POST_VALIDATION = {
  MAX_TITLE_LENGTH: 50,
  MAX_CONTENT_LENGTH: 10_000,
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE: 15 * 1024 * 1024, // 15MB
  MAX_FILES: 10,
  MAX_FILE_SIZE: 20 * 1024 * 1024, // 20MB
} as const;

/**
 * 파일 첨부 input 의 accept 값.
 *
 * 확장자만 나열하면 일부 모바일 WebView 가 필터를 해석하지 못해
 * 문서를 아예 고를 수 없게 되므로 MIME 타입을 함께 적는다.
 */
export const POST_FILE_ACCEPT = [
  'application/pdf,.pdf',
  'application/msword,.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx',
  'application/vnd.ms-excel,.xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.xlsx',
  'application/vnd.ms-powerpoint,.ppt',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation,.pptx',
  'application/zip,application/x-zip-compressed,.zip',
  'text/plain,.txt',
].join(',');

export type PostValidationRule = typeof POST_VALIDATION;
