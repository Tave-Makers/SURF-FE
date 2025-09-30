'use client';

import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import OnBoardingForm from '@/widgets/onboarding/ui/OnBoardingForm';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function OnBoardingPage() {
  const profileImageUrl = useAuthStore((state) => state.profileImageUrl);
  console.log('zustand에서 읽은 프로필 URL:', profileImageUrl);

  const methods = useForm<OnBoardingFormData>({
    defaultValues: {
      name: '',
      profileImageUrl: '',
      tracks: [{ generation: null, part: null }],
      university: '',
      gradSchool: '',
      email: '',
      phoneNumber: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
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
