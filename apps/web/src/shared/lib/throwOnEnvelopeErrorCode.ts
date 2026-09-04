import { AxiosError, type AxiosResponse } from 'axios';

type CommonEnvelope = {
  code: number;
  message: string;
};

const isCommonEnvelope = (data: unknown): data is CommonEnvelope => {
  if (typeof data !== 'object' || data === null) return false;
  const o = data as Record<string, unknown>;

  return typeof o.code === 'number' && typeof o.message === 'string';
};

const isSuccessCode = (code: number) => code >= 200 && code < 300;

/**
 * 백엔드가 컨트롤러에서 ApiResponse 를 그대로 return 하면 실패 응답도 HTTP 200 으로 나가고,
 * 실제 결과는 body 의 code 에만 담긴다. (예: 회원가입 블랙리스트 -> 200 + { code: 403 })
 * 그대로 두면 axios 가 resolve 해서 실패가 성공 플로우를 타므로, 여기서 에러로 승격한다.
 *
 * 이후 코드가 `error.response.status` 하나만 보면 되도록 status 를 body 의 code 로 맞춘다.
 * 따라서 DevTools 의 상태(200)와 코드가 보는 status(403 등)가 다를 수 있다.
 */
export function throwOnEnvelopeErrorCode(response: AxiosResponse): AxiosResponse {
  const data: unknown = response.data;

  if (!isCommonEnvelope(data) || isSuccessCode(data.code)) return response;

  throw new AxiosError(
    data.message,
    data.code >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
    response.config,
    response.request,
    { ...response, status: data.code },
  );
}
