import { useMutation } from '@tanstack/react-query';
import { unregisterDeviceToken } from '@/entities/notification/lib/unregisterDeviceToken';
import { logout } from '@/features/auth/api/logout.client';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { postToNative } from '@/shared/lib/nativeBridge';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@surf/ui/store/toastStore';

const LOGOUT_MESSAGE = '로그아웃 되었습니다.';

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const showToast = useToastStore((s) => s.show);
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // 토큰 삭제는 access token이 살아있을 때만 가능하므로 로그아웃보다 먼저 (실패해도 진행)
      await unregisterDeviceToken();
      await logout();
    },
    onSuccess: () => {
      clearAuth();
      // 앱은 /login 도착을 보고 로그아웃을 추측한다. 명시적으로 알려 주면 바로 로그인 화면으로 돌아간다
      postToNative({ type: 'LOGGED_OUT', message: LOGOUT_MESSAGE });
      showToast(LOGOUT_MESSAGE);
      router.replace('/login');
    },
    onError: (e) => {
      console.error('로그아웃 실패: ', e);
      showToast('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
