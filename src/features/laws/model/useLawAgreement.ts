import { useRouter } from 'next/navigation';
import { useAgreementStore } from './useAgreementStore';

export const useLawAgreement = () => {
  const router = useRouter();

  const { agreements, setAgreement } = useAgreementStore();

  const handleCheck = (id: string, checked: boolean) => {
    setAgreement(id, checked);
  };

  const isAllRequiredChecked = agreements.laws1 && agreements.laws2 && agreements.laws3;

  const onClickLawDetail = (id: string) => {
    if (id === 'laws1') {
      router.push('/settings/policy/service');
    } else if (id === 'laws2') {
      router.push('/settings/policy/personal-info');
    } else if (id === 'laws3') {
      router.push('/settings/policy/marketing-info');
    }
  };

  return { agreements, handleCheck, isAllRequiredChecked, onClickLawDetail };
};
