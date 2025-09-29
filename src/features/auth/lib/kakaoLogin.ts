import { API_BASE_URL } from '@/shared/config/env';

export const kakaoLogin = () => {
  window.location.href = `${API_BASE_URL}/login/kakao`;
};
