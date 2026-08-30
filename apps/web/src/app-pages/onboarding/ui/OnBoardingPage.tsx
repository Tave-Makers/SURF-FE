'use client';

import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useGetValidStatusQuery } from '@/features/auth/model/useGetValidStatusQuery';
import { useLawAgreement } from '@/features/laws/model/useLawAgreement';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { OnBoardingForm } from '@/widgets/onboarding/ui/OnBoardingForm';

const OnBoardingPage = () => {
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
    const shouldOpen = statusData?.memberStatus === 'REGISTERING' && !isAgreed && step != 2;

    if (shouldOpen) {
      openBottomSheet({
        type: 'law',
        props: {
          agreements,
          onCheck: handleCheck,
          // 서버 기록이 성공해야 시트가 닫힌다 (실패 시 재시도 가능)
          onClickPrimaryBtn: () => {
            confirmAgreement(() => closeBottomSheet());
          },
          onClickLawDetail: (id: string) => {
            onClickLawDetail(id);
            setTimeout(() => closeBottomSheet(), 200);
          },
          allAgreed: isAllRequiredChecked,
        },
      });
    } else if (useBottomSheetStore.getState().current?.type === 'law') {
      // 바텀시트 슬롯은 전역에 하나뿐이므로, 이 이펙트는 자기가 연 약관 시트만 닫는다.
      // (계정 통합 시트 등 다른 시트가 열려 있을 때 닫아버리지 않도록 한다)
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
};

export default OnBoardingPage;
