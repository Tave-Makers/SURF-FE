'use client';

import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import OnBoardingForm from '@/widgets/onboarding/ui/OnBoardingForm';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { kakaoImgNormalize } from '@/shared/lib/kakaoImgNormalize';

export default function OnBoardingPage() {
  const profileImageUrl = kakaoImgNormalize(useAuthStore((state) => state.profileImageUrl));

  const methods = useForm<OnBoardingFormData>({
    defaultValues: {
      name: '',
      profileImage: undefined,
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
    if (profileImageUrl) {
      methods.setValue('profileImageUrl', profileImageUrl, {
        shouldValidate: false,
        shouldDirty: false,
      });
    }
  }, [profileImageUrl, methods]);
  return (
    <FormProvider {...methods}>
      <OnBoardingForm />
    </FormProvider>
  );
}
