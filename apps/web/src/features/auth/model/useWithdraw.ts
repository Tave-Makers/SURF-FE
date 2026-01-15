import { useMutation } from '@tanstack/react-query';
import { withdraw } from '@/features/auth/api/withdraw.client';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@surf/ui/store/toastStore';

export function useWithdraw() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const showToast = useToastStore((s) => s.show);
  const router = useRouter();

  return useMutation({
    mutationFn: withdraw,
    onSuccess: () => {
      clearAuth();
      showToast('탈퇴가 완료되었습니다.');
      router.replace('/login');
    },
    onError: (e) => {
      console.error('회원 탈퇴 실패: ', e);
      showToast('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
