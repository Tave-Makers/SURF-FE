import { useToastStore } from '@surf/ui/store/toastStore';
import { useMutation } from '@tanstack/react-query';
import { agreeTerms } from '../api/agreeTerms';

function formatAgreedAt(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}.${hh}:${min}에 동의하였습니다.`;
}

export function useAgreeTerms() {
  const showToast = useToastStore((s) => s.show);

  return useMutation({
    mutationFn: agreeTerms,
    onSuccess: () => {
      showToast(formatAgreedAt(new Date()));
    },
    onError: (e) => {
      console.error('약관 동의 실패:', e);
      showToast('약관 동의에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
