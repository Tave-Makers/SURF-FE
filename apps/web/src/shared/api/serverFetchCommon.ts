import 'server-only';
import type { CommonResponse, Guard, ServerFetchOptions } from './types';
import { ApiError } from './ApiError';
import { previewBody, serverFetchJsonGuarded } from './serverFetchJsonGuarded';

const isCommonEnvelope = (x: unknown): x is CommonResponse<unknown> => {
  if (typeof x !== 'object' || x === null) return false;
  const o = x as Record<string, unknown>;

  return typeof o.code === 'number' && typeof o.message === 'string';
};

const isSuccessCode = (code: number) => code >= 200 && code < 300;

/**
 * `{ code, message, data }` 봉투 응답 전용 fetch.
 * 봉투 검증 → code 판정 → data 가드 순서로 처리해, 서버가 내려준 에러 코드가
 * 스키마 불일치로 둔갑하지 않도록 한다.
 */
export async function serverFetchCommon<T>(
  path: string,
  dataGuard: Guard<T>,
  init: ServerFetchOptions = {},
): Promise<T> {
  const res = await serverFetchJsonGuarded(path, isCommonEnvelope, init);

  if (!isSuccessCode(res.code)) {
    throw new ApiError(path, res.code, res.message);
  }

  if (!dataGuard(res.data)) {
    throw new Error(`Invalid data shape for ${path} (code ${res.code}): ${previewBody(res.data)}`);
  }

  return res.data;
}
