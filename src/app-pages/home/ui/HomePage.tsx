'use client';

import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { useState } from 'react';

export const HomePage = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { agreements, handleCheck, isAllRequiredChecked, onClickLawDetail } = useLawAgreement();

  return (
    <div>
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
      />
    </div>
  );
};
