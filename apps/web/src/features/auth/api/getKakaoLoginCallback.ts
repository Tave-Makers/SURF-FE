import axios from 'axios';
import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { KakaoLoginResponse } from './types';

export async function getKakaoLoginCallback(
  code: string,
  state: string,
): Promise<KakaoLoginResponse> {
  const endpoint = '/login/oauth2/code/kakao';

  try {
    const res = await axiosInstance.get<KakaoLoginResponse>(endpoint, {
      params: { code, state },
    });

    return res.data;
  } catch (error) {
    console.error('[API][KAKAO] error', error);
    throw new Error(getKakaoLoginErrorMessage(error));
  }
}

function getKakaoLoginErrorMessage(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return '카카오 로그인 중 문제가 발생했어요. 잠시 후 다시 시도해주세요.';
  }

  switch (error.response?.status) {
    case 400:
      return '로그인 요청이 만료됐어요. 다시 로그인해주세요.';
    case 409:
      return '이미 가입된 계정이에요. 기존 로그인 방식으로 다시 시도해주세요.';
    default:
      return '카카오 로그인에 실패했어요. 잠시 후 다시 시도해주세요.';
  }
}
