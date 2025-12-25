import { useMutation } from '@tanstack/react-query';
import { registerDeviceToken } from '../api/registerToken';

export function useRegisterToken() {
  return useMutation({
    mutationFn: registerDeviceToken,
    onSuccess: () => {
      sessionStorage.setItem('isFcmRegistered', 'true');
      console.log('FCM 토큰 서버 등록 성공');
    },
    onError: (err) => {
      console.error('FCM 토큰 등록 실패', err);
    },
  });
}
