import { useMutation } from '@tanstack/react-query';
import { useToastStore } from '@surf/ui/store/toastStore';
import { agreeTerms } from '../api/agreeTerms';
import { useAgreementStore } from './useAgreementStore';

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
  const setAgreed = useAgreementStore((s) => s.setAgreed);

  return useMutation({
    mutationFn: agreeTerms,
    // 동의 확정은 mutation 레벨에서 처리한다. mutate() 호출별 콜백은 요청 중
    // 컴포넌트가 언마운트되면(약관 상세로 이동 등) 실행되지 않아 동의가 유실된다.
    onSuccess: () => {
      setAgreed(true);
      showToast(formatAgreedAt(new Date()));
    },
    onError: (e) => {
      console.error('약관 동의 실패:', e);
      showToast('약관 동의에 실패했습니다. 잠시 후 다시 시도해주세요.');
    },
  });
}
