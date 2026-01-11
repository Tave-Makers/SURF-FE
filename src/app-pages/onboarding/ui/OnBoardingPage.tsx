'use client';

import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import OnBoardingForm from '@/widgets/onboarding/ui/OnBoardingForm';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { useGetValidStatusQuery } from '@/features/auth/model/useGetValidStatusQuery';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

export default function OnBoardingPage() {
  const nickname = useOnboardingStore((s) => s.nickname);
  const email = useOnboardingStore((s) => s.email);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);

  const {
    agreements,
    handleCheck,
    isAllRequiredChecked,
    onClickLawDetail,
    isAgreed,
    confirmAgreement,
  } = useLawAgreement();
  const [step, setStep] = useState(0);

  const { data: statusData } = useGetValidStatusQuery();

  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  useEffect(() => {
    const shouldOpen =
      // statusData?.memberStatus === 'REGISTERING' &&
      !isAgreed && step != 2;

    if (shouldOpen) {
      openBottomSheet({
        type: 'law',
        props: {
          agreements,
          onCheck: handleCheck,
          onClickPrimaryBtn: () => {
            confirmAgreement();
            closeBottomSheet();
          },
          onClickLawDetail: (id: string) => {
            onClickLawDetail(id);
            setTimeout(() => closeBottomSheet(), 200);
          },
          allAgreed: isAllRequiredChecked,
        },
      });
    } else {
      closeBottomSheet();
    }
  }, [
    statusData,
    isAgreed,
    step,
    openBottomSheet,
    closeBottomSheet,
    agreements,
    handleCheck,
    confirmAgreement,
    onClickLawDetail,
    isAllRequiredChecked,
  ]);

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
      <OnBoardingForm step={step} setStep={setStep} />
    </FormProvider>
  );
}
