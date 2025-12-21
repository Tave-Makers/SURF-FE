'use client';

import { KakaoLoginButton } from '@/features/auth/ui/KakaoLoginButton';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { useState } from 'react';

export function LoginPage() {
  const [isOpen, setIsOpen] = useState(true);
  const { agreements, handleCheck, handleAllAgree, isAllRequiredChecked, onClickLawDetail } =
    useLawAgreement();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center px-13">
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
            handleAllAgree();
          }
        }}
        onClickLawDetail={onClickLawDetail}
      />
    </div>
  );
}
