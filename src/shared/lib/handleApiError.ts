import axios from 'axios';

export type DefaultError = {
  code: number;
  message: string;
  errorCode: string;
};

export type LoginCallBackError = {
  timestamp: string;
  path: string;
  status: number;
  message: string;
  error: string;
  requestId: string;
};

export type ErrorResponse = DefaultError | LoginCallBackError;

export function handleApiError(
  error: unknown,
  defaultMessage = '[Unknown Error] 알 수 없는 에러',
): Error {
  if (axios.isAxiosError(error)) {
    // 백엔드 에러
    if (error.response) {
      const data = error.response?.data as ErrorResponse | undefined;
      let message = defaultMessage;

      if (data) {
        if ('errorCode' in data) {
          // DefaultError
          message = data.message || defaultMessage;
          console.error(
            `[Backend Error] ${data.message} (code=${data.errorCode}, status=${data.code})`,
          );
        } else if ('requestId' in data) {
          // LoginCallBackError
          message = data.message || defaultMessage;
          console.error(
            `[Backend Error - LoginCallback] ${data.message} (code=${data.error}, path=${data.path}, requestId=${data.requestId})`,
          );
        }
      }

      return new Error(`[Backend Error] ${message}`);
    }

    // 요청은 갔지만 응답이 없는 경우
    if (error.request) {
      console.error('[Frontend/Network Error] 서버 응답 없음', error.request);
      return new Error('[Frontend/Network Error] 서버 응답이 없습니다.');
    }
  }

  // 일반 프론트 코드 에러
  if (error instanceof Error) {
    console.error('[Frontend Code Error]', error);
    return new Error(`[Frontend Code Error] ${error.message}`);
  }

  // 알 수 없는 에러
  console.error('[Unknown Error]', error);
  return new Error(defaultMessage);
}
