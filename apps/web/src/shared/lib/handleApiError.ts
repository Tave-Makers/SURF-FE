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

/** `errorCode` 없이 내려오는 백엔드 공통 응답 (예: 409 계정 충돌) */
export type EnvelopeError = {
  code: number;
  message: string;
  data?: unknown;
};

export type ErrorResponse = DefaultError | LoginCallBackError | EnvelopeError;

export function handleApiError(
  error: unknown,
  defaultMessage = '[Unknown Error] 알 수 없는 에러',
): Error {
  if (axios.isAxiosError(error)) {
    // 백엔드가 응답을 준 경우
    if (error.response) {
      const data = error.response.data as ErrorResponse | undefined;
      let message = defaultMessage;

      if (data) {
        if ('errorCode' in data) {
          message = data.message || defaultMessage;
          console.error(
            `[Backend Error] ${data.message} (errorCode=${data.errorCode}, code=${data.code})`,
          );
        } else if ('requestId' in data) {
          message = data.message || defaultMessage;
          console.error(
            `[Backend Error - LoginCallback] ${data.message} (error=${data.error}, path=${data.path}, requestId=${data.requestId})`,
          );
        } else if (typeof data.message === 'string' && data.message) {
          // errorCode 없이 { code, message, data }만 내려오는 응답
          message = data.message;
          console.error(`[Backend Error] ${data.message} (code=${data.code})`);
        }
      }

      return new Error(message);
    }

    // 요청은 갔지만 응답 없음
    if (error.request) {
      console.error('[Network Error] 서버 응답 없음', error.request);
      return new Error('서버 응답이 없습니다. 네트워크 상태를 확인해주세요.');
    }

    // axios 설정 문제 등
    console.error('[Axios Error]', error.message);
    return new Error(error.message || defaultMessage);
  }

  // 일반 프론트 코드 에러
  if (error instanceof Error) {
    console.error('[Frontend Code Error]', error);
    return error;
  }

  console.error('[Unknown Error]', error);
  return new Error(defaultMessage);
}
