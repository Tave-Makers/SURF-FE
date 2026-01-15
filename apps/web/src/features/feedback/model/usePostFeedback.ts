import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AxiosError } from 'axios';
import { postFeedback } from '../api/postFeedback';

// 피드백 보내기 훅
export const usePostFeedback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postFeedback,
    onSuccess: () => {
      // 피드백 보내기 성공 시 로직
      alert('소중한 피드백 감사합니다.');
    },
    onError: (error: AxiosError) => {
      // 피드백 보내기 실패 시 로직
      let errorMessage = '피드백 전송에 실패했습니다.';

      if (error.response?.status === 429) {
        errorMessage = '피드백은 하루 3회로 제한됩니다! 설정 페이지로 이동합니다.';
        router.push(PAGE_ROUTES.MYPAGE.SETTINGS);
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      alert(errorMessage);
    },
  });
};
