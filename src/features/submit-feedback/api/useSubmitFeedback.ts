import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { postFeedBack } from './postFeedBack';

interface ApiError {
  response?: {
    status: number;
  };
  code?: string;
  message?: string;
}

// 피드백 보내기 훅
export const useSubmitFeedback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postFeedBack,
    onSuccess: () => {
      // 피드백 보내기 성공 시 로직
      alert('소중한 피드백 감사합니다.');
      router.push('/mypage/settings/feedback');
    },
    onError: (error: ApiError) => {
      // 피드백 보내기 실패 시 로직
      console.error('피드백 전송 실패:', error);
    },
  });
};
