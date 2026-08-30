import { useMutation } from '@tanstack/react-query';
import { unregisterDeviceToken } from '@/entities/notification/lib/unregisterDeviceToken';
import { withdraw } from '@/features/auth/api/withdraw.client';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@surf/ui/store/toastStore';

export function useWithdraw() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const showToast = useToastStore((s) => s.show);
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      // 탈퇴는 제명과 달리 서버가 디바이스 토큰을 지우지 않는다 (SURF-BE #389 기준).
      // 로그아웃과 같이 access token이 살아있을 때 직접 지운다 — 실패해도 탈퇴는 진행
      await unregisterDeviceToken();
      await withdraw();
    },
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
