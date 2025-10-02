import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { postFeedback } from '../api/postFeedback';

interface ApiError {
  response?: {
    status: number;
  };
  code?: string;
  message?: string;
}

// 피드백 보내기 훅
export const usePostFeedback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postFeedback,
    onSuccess: () => {
      // 피드백 보내기 성공 시 로직
      alert('소중한 피드백 감사합니다.');
      router.push('/mypage/settings/feedback');
    },
    onError: (error: ApiError) => {
      // 피드백 보내기 실패 시 로직
      console.error('피드백 전송 실패:', error);

      let errorMessage = '피드백 전송에 실패했습니다.';

      if (error.response?.status === 429) {
        errorMessage = '피드백은 하루 3회로 제한됩니다! 설정 페이지로 이동합니다.';
        router.push('/mypage/settings');
      } else if (error.response?.status === 500) {
        errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      }

      alert(errorMessage);
    },
  });
};
