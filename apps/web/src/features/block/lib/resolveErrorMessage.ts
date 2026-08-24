import axios from 'axios';

/** 백엔드가 상태 코드로 구분해 내려주는 실패 사유를 사용자 문구로 바꾼다 */
export const resolveErrorMessage = (
  error: unknown,
  messageByStatus: Record<number, string>,
  fallback: string,
): string => {
  if (!axios.isAxiosError(error)) return fallback;

  const status = error.response?.status;
  if (status === undefined) return fallback;

  return messageByStatus[status] ?? fallback;
};
