'use client';

import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import OnBoardingForm from '@/widgets/onboarding/ui/OnBoardingForm';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { LawBottomSheet } from '@/features/laws/ui/LawBottomSheet';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { useGetValidStatusQuery } from '@/features/auth/model/useGetValidStatusQuery';

export default function OnBoardingPage() {
  const nickname = useOnboardingStore((s) => s.nickname);
  const email = useOnboardingStore((s) => s.email);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);

  const { agreements, handleCheck, isAllRequiredChecked, onClickLawDetail } = useLawAgreement();
  const [isOpen, setIsOpen] = useState(!agreements.laws1 || !agreements.laws2 || !agreements.laws3);

  const { data: statusData } = useGetValidStatusQuery();

  useEffect(() => {
    if (statusData?.memberStatus === 'REGISTERING') {
      setIsOpen(true);
    }
  }, [statusData]);

  const methods = useForm<OnBoardingFormData>({
    defaultValues: {
      name: '',
      profileImage: undefined, // File 객체용
      profileImageUrl: '', // 카카오 URL용
      tracks: [{ generation: null, part: null }],
      university: '',
      graduateSchool: '',
      email: '',
      phoneNumber: '',
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  useEffect(() => {
    if (nickname) {
      methods.setValue('name', nickname, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }

    if (email) {
      methods.setValue('email', email, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }

    if (profileImageUrl) {
      methods.setValue('profileImageUrl', profileImageUrl, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [nickname, email, profileImageUrl, methods]);

  return (
    <FormProvider {...methods}>
      <OnBoardingForm />

      {/* 약관 바텀 시트 */}
      <LawBottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        agreements={agreements}
        onCheck={handleCheck}
        onClickPrimaryBtn={() => {
          setIsOpen(false);
        }}
        onClickLawDetail={onClickLawDetail}
        allAgreed={isAllRequiredChecked}
      />
    </FormProvider>
  );
}
