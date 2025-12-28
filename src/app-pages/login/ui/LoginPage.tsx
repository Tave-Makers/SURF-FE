'use client';

import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { useState } from 'react';
import Logo from '../../../../public/logo.svg';

export function LoginPage() {
  const { agreements, handleCheck, isAllRequiredChecked, onClickLawDetail } = useLawAgreement();
  const [isOpen, setIsOpen] = useState(!agreements.laws1 || !agreements.laws2 || !agreements.laws3);

  return (
    <div className="flex h-dvh w-dvw flex-col items-center gap-[6.75rem] px-15 pt-[16.81rem]">
      <Logo width={163.684} height={55.04} />
      <KakaoLoginButton />
      <LawBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        agreements={agreements}
        onCheck={handleCheck}
        onClickPrimaryBtn={() => {
          if (isAllRequiredChecked) {
            setIsOpen(false);
          } else {
            alert('필수 약관에 모두 동의해 주세요.');
          }
        }}
        onClickLawDetail={onClickLawDetail}
        allAgreed={isAllRequiredChecked}
      />
    </div>
  );
}
