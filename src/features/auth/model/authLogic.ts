import { getValidStatus } from '../api/getValidStatus';
import { getKakaoLoginCallback } from '../api/getKakaoLoginCallback';

import { useAuthStore } from './useAuthStore';

export async function handleKakaoLoginCallback(code: string): Promise<string> {
  const setAuth = useAuthStore.getState().setAuth;

  // 1. 카카오 로그인 콜백
  const res = await getKakaoLoginCallback(code);
  setAuth({
    accessToken: res.data.accessToken,
    nickname: res.data.nickname,
    email: res.data.email,
    profileImageUrl: res.data.profileImageUrl,
  });

  // 2. 온보딩 여부 확인
  const validStatus = await getValidStatus();
  return validStatus.data ? '/onboarding' : '/home';
}
