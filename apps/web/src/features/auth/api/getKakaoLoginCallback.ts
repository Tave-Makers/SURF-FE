import { axiosInstance } from '@/shared/lib/axiosInstance';
import type { KakaoLoginResponse } from './types';
import { handleApiError } from '@/shared/lib/handleApiError';

export async function getKakaoLoginCallback(code: string): Promise<KakaoLoginResponse> {
  const endpoint = '/login/oauth2/code/kakao';

  console.log('[API][KAKAO] request', {
    endpoint,
    code,
  });

  try {
    const res = await axiosInstance.get<KakaoLoginResponse>(endpoint, { params: { code } });

    console.log('[API][KAKAO] response', res);
    console.log('[API][KAKAO] response.data', res.data);

    return res.data;
  } catch (error) {
    console.error('[API][KAKAO] error', error);
    throw handleApiError(error, endpoint);
  }
}
