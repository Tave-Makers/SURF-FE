import { useMutation } from '@tanstack/react-query';
import { unregisterDeviceToken } from '@/entities/notification/lib/unregisterDeviceToken';
import { logout } from '@/features/auth/api/logout.client';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@surf/ui/store/toastStore';

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
      showToast('로그아웃 되었습니다.');
      router.replace('/login');
    },
    onError: (e) => {
      console.error('로그아웃 실패: ', e);
      showToast('로그아웃에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
