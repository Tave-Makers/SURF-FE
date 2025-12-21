import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useLawAgreement = () => {
  const router = useRouter();

  const [agreements, setAgreements] = useState({
    laws1: false, // 서비스 이용약관
    laws2: false, // 개인정보 수집
    laws3: false, // 마케팅 수신
  });

  const handleCheck = (id: string, checked: boolean) => {
    setAgreements((prev) => ({ ...prev, [id]: checked }));
  };

  const handleAllAgree = () => {
    setAgreements({ laws1: true, laws2: true, laws3: true });
  };

  const isAllRequiredChecked = agreements.laws1 && agreements.laws2;

  const onClickLawDetail = (id: string) => {
    if (id === 'laws1') {
      router.push('/mypage/settings/policy/service');
    } else if (id === 'laws2') {
      router.push('/mypage/settings/policy/personal-info');
    } else if (id === 'laws3') {
      router.push('/mypage/settings/policy/marketing-info');
    }
  };

  return { agreements, handleCheck, handleAllAgree, isAllRequiredChecked, onClickLawDetail };
};
