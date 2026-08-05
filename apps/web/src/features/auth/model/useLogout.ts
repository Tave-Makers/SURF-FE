import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { logout } from '@/features/auth/api/logout.client';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const showToast = useToastStore((s) => s.show);
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
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
