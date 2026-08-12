import { useAlertStore } from '@surf/ui/store/alertStore';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { postFeedback } from '@/features/feedback/api/postFeedback';
import { PAGE_ROUTES } from '@/shared/config/path';

// 피드백 보내기 훅
export const usePostFeedback = () => {
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  return useMutation({
    mutationFn: postFeedback,
    onSuccess: () => {
      openAlert({
        state: 'default',
        title: '소중한 피드백 감사합니다.',
        actions: [{ type: 'text', label: '확인', variant: 'primary', onClick: closeAlert }],
      });
    },
    onError: (error: AxiosError) => {
      // 피드백 보내기 실패 시 로직
      let errorMessage = '피드백 전송에 실패했습니다.';
      let onConfirm = closeAlert;

      if (error.response?.status === 429) {
        errorMessage = '피드백은 하루 3회로 제한됩니다! 설정 페이지로 이동합니다.';
        onConfirm = () => {
          closeAlert();
          router.push(PAGE_ROUTES.MYPAGE.SETTINGS);
        };
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      openAlert({
        state: 'error',
        title: errorMessage,
        actions: [{ type: 'text', label: '확인', variant: 'primary', onClick: onConfirm }],
      });
    },
  });
};
