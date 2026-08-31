import { useMutation } from '@tanstack/react-query';
import { unregisterDeviceToken } from '@/entities/notification/lib/unregisterDeviceToken';
import { withdraw } from '@/features/auth/api/withdraw.client';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { postToNative } from '@/shared/lib/nativeBridge';
import { useRouter } from 'next/navigation';
import { useToastStore } from '@surf/ui/store/toastStore';

const WITHDRAW_MESSAGE = '탈퇴가 완료되었습니다.';

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
      // 앱은 /login 도착을 보고 로그아웃을 추측한다. 명시적으로 알려 주면 바로 로그인 화면으로 돌아간다
      postToNative({ type: 'LOGGED_OUT', message: WITHDRAW_MESSAGE });
      showToast(WITHDRAW_MESSAGE);
      router.replace('/login');
    },
    onError: (e) => {
      console.error('회원 탈퇴 실패: ', e);
      showToast('회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
