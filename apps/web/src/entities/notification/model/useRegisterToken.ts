import { useMutation } from '@tanstack/react-query';
import { registerDeviceToken } from '../api/registerToken';
import { FCM_REGISTERED_FLAG_KEY, saveRegisteredDeviceToken } from '../lib/deviceTokenStorage';

export function useRegisterToken() {
  return useMutation({
    mutationFn: registerDeviceToken,
    onSuccess: (_data, variables) => {
      sessionStorage.setItem(FCM_REGISTERED_FLAG_KEY, 'true');
      // 로그아웃 때 같은 값으로 삭제 요청을 보내야 해서 보관해둔다
      saveRegisteredDeviceToken(variables.token);
      if (process.env.NODE_ENV === 'development') {
        console.log('FCM 토큰 서버 등록 성공');
      }
    },
    onError: (err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('FCM 토큰 등록 실패', err);
      }
    },
  });
}
