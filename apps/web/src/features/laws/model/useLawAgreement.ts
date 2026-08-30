import { PAGE_ROUTES } from '@/shared/config/path';
import { useRouter } from 'next/navigation';
import { useAgreeTerms } from './useAgreeTerms';
import { useAgreementStore } from './useAgreementStore';

export const useLawAgreement = () => {
  const router = useRouter();

  const { agreements, setAgreement, isAgreed, setAgreed } = useAgreementStore();
  const { mutate: agreeTerms, isPending: isAgreeing } = useAgreeTerms();

  const handleCheck = (id: string, checked: boolean) => {
    setAgreement(id, checked);
  };

  /**
   * 동의 이력을 서버에 먼저 남기고, 성공했을 때만 진행시킨다.
   * 로컬 플래그만 세우면 sessionStorage에만 남아 동의 증빙이 되지 않는다.
   * 실패하면 시트를 닫지 않아 사용자가 다시 시도할 수 있다.
   */
  const confirmAgreement = (onSuccess?: () => void) => {
    if (isAgreeing) return;

    agreeTerms(undefined, {
      onSuccess: () => {
        setAgreed(true);
        onSuccess?.();
      },
    });
  };

  const isAllRequiredChecked = agreements.laws1 && agreements.laws2 && agreements.laws3;

  const onClickLawDetail = (id: string) => {
    if (id === 'laws1') {
      router.push(PAGE_ROUTES.PUBLIC_POLICY.SERVICE);
    } else if (id === 'laws2') {
      router.push(PAGE_ROUTES.PUBLIC_POLICY.PRIVACY);
    } else if (id === 'laws3') {
      router.push(PAGE_ROUTES.PUBLIC_POLICY.OPERATING);
    }
  };

  return {
    agreements,
    handleCheck,
    isAllRequiredChecked,
    onClickLawDetail,
    isAgreed,
    confirmAgreement,
    isAgreeing,
  };
};
