import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
// import { api } from '@/shared/api';

// 서버에 보낼 데이터 타입
interface SubmitFeedbackPayload {
  content: string;
}

const submitFeedback = async (payload: SubmitFeedbackPayload) => {
  // const { data } = await api.post('/feedback', payload);
  // return data;

  // 임시 API 호출
  console.log('API 호출:', payload);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 대기
  return { success: true };
};

export const useSubmitFeedback = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      // 성공 시 로직
      alert('소중한 피드백 감사합니다!');
      router.back();
    },
    onError: (error) => {
      // 실패 시 로직
      alert('피드백 전송에 실패했습니다.');
      console.error(error);
    },
  });
};
