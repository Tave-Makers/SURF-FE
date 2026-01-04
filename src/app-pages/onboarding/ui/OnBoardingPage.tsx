'use client';

import { useOnboardingStore } from '@/features/onboarding/model/useOnboardingStore';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import OnBoardingForm from '@/widgets/onboarding/ui/OnBoardingForm';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function OnBoardingPage() {
  const nickname = useOnboardingStore((s) => s.nickname);
  const email = useOnboardingStore((s) => s.email);
  const profileImageUrl = useOnboardingStore((s) => s.profileImageUrl);

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
    </FormProvider>
  );
}
