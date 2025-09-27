import { axiosInstance } from '@/shared/lib/axiosInstance';
import { KakaoLoginResponse } from './types';
import { handleApiError } from '@/shared/lib/handleApiError';

export const getKakaoLoginCallback = async (code: string): Promise<KakaoLoginResponse> => {
  const endpoint = '/login/oauth2/code/kakao';
  try {
    const res = await axiosInstance.get<KakaoLoginResponse>(endpoint, {
      params: { code },
    });
    return res.data;
  } catch (error) {
    throw handleApiError(error, endpoint);
  }
};
