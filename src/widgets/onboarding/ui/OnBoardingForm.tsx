import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import OnBoardingLayout from './OnBoardingLayout';
import { ONBOARDING_EVENTS, OnBoardingFormData } from '@/features/onboarding/model/types';
import { ProfileStep } from '@/features/onboarding/ui/ProfileStep';
import { TrackUnivStep } from '@/features/onboarding/ui/TrackUnivStep';
import { EmailPhoneStep } from '@/features/onboarding/ui/EmailPhoneStep';
import { useRouter } from 'next/navigation';
import { submitOnBoarding } from '@/features/onboarding/api/submitOnBoarding';
import { PAGE_ROUTES } from '@/shared/config/path';
import axios from 'axios';
import { DefaultError } from '@/shared/lib/handleApiError';
import { trackOnBoardingEvent } from '@/features/onboarding/lib/trackOnBoardingEvent';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { safeUUID } from '@/shared/utils/uuid';
import { Alert } from '@/shared/ui/alert/Alert';

const STEP_ANALYTICS_NAMES: Record<number, 'nickname' | 'track' | 'contact'> = {
  0: 'nickname',
  1: 'track',
  2: 'contact',
};

export default function OnBoardingForm() {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const methods = useFormContext<OnBoardingFormData>();
  const router = useRouter();
  type StepConfig = {
    component: React.FC;
    title: string;
    description: string;
    validationFields: (keyof OnBoardingFormData)[];
  };
  const { uploadImages } = useImageUploader();

  const steps: StepConfig[] = [
    {
      component: ProfileStep,
      title: '프로필을 만들어봐요',
      description: '성함과 프로필 사진을 등록해주세요.',
      validationFields: ['name'],
    },
    {
      component: TrackUnivStep,
      title: '필수 정보를 입력해주세요.',
      description: '기존 TAVE 활동 정보를 입력해주세요.',
      validationFields: ['tracks', 'university'],
    },
    {
      component: EmailPhoneStep,
      title: '필수 정보를 입력해주세요.',
      description: '기존 TAVE 활동 정보를 입력해주세요.',
      validationFields: ['email', 'phoneNumber'],
    },
  ];

  const StepComponent = steps[step].component;

  const { control } = methods;

  const watchedName = useWatch({ control, name: 'name' });
  const watchedUniversity = useWatch({ control, name: 'university' });
  const watchedTracks = useWatch({ control, name: 'tracks' });
  const watchedEmail = useWatch({ control, name: 'email' });
  const watchedPhoneNumber = useWatch({ control, name: 'phoneNumber' });

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedEmail ?? '');
  const isValidPhone = /^[0-9]{10,11}$/.test(watchedPhoneNumber ?? '');

  const hasValidTrack =
    Array.isArray(watchedTracks) &&
    watchedTracks.some((t) => t?.generation != null && t?.part != null);

  const canProceedByField: Partial<Record<keyof OnBoardingFormData, boolean>> = {
    name: (watchedName?.trim().length ?? 0) >= 2,
    university: (watchedUniversity?.trim().length ?? 0) >= 1,
    tracks: hasValidTrack,
    email: isValidEmail,
    phoneNumber: isValidPhone,
  };

  const currentValidationFields = steps[step].validationFields;

  const isNextBtnDisabled = currentValidationFields.some((field) => !canProceedByField[field]);

  // step이 바뀔 때마다 signup_page_view 트래킹
  useEffect(() => {
    trackOnBoardingEvent(ONBOARDING_EVENTS.VIEW_SIGNUP_PAGE, {
      step: STEP_ANALYTICS_NAMES[step],
    });
  }, [step]);

  // 프로필 이미지 업로드
  async function uploadProfileImage(file: File) {
    try {
      const [result] = await uploadImages([
        {
          id: safeUUID(),
          file,
          preview: '',
          status: 'pending',
        },
      ]);

      if (!result || result.status === 'error' || !result.uploadedUrl) {
        throw new Error();
      }

      return result.uploadedUrl;
    } catch {
      throw new Error('PROFILE_IMAGE_UPLOAD_FAILED');
    }
  }

  async function onSubmit(data: OnBoardingFormData) {
    let finalProfileImageUrl = data.profileImageUrl;

    // 1. 새로 선택한 이미지가 있으면 S3 업로드
    if (data.profileImage instanceof File) {
      finalProfileImageUrl = await uploadProfileImage(data.profileImage);
    }
    // 2. 서버로 보낼 payload 구성
    const submitData = {
      ...data,
      profileImageUrl: finalProfileImageUrl,
    };

    delete submitData.profileImage;

    const filledCount = Object.values(submitData).filter(
      (v) => v !== '' && v !== null && !(Array.isArray(v) && v.length === 0),
    ).length;

    trackOnBoardingEvent(ONBOARDING_EVENTS.SUBMIT_SIGNUP_FORM, {
      input_count: filledCount,
    });
    await submitOnBoarding(submitData);
    setIsAlertOpen(true);
  }

  async function handleNext() {
    const isValid = await methods.trigger(steps[step].validationFields);
    if (!isValid) return;

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);
      await methods.handleSubmit(onSubmit)();
      router.push(PAGE_ROUTES.HOME);
    } catch (error) {
      if (error instanceof Error && error.message === 'PROFILE_IMAGE_UPLOAD_FAILED') {
        alert('프로필 이미지 업로드에 실패했습니다.');
        return;
      }

      if (axios.isAxiosError(error) && error.response) {
        const status = error.response.status;
        const data = error.response.data as DefaultError;

        switch (status) {
          case 400:
            alert(data.message || '입력한 정보가 올바르지 않습니다.');
            router.push(PAGE_ROUTES.ONBOARDING);
            break;
          case 409:
            alert(data.message || '이미 존재하는 회원입니다. 로그인 페이지로 이동합니다.');
            router.push(PAGE_ROUTES.LOGIN);
            break;
          default:
            alert(data.message || '알 수 없는 오류가 발생했습니다.');
        }
      } else {
        alert('네트워크 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <OnBoardingLayout
        step={step}
        setStep={setStep}
        title={steps[step].title}
        description={steps[step].description}
        onNextBtnClick={() => {
          void handleNext();
        }}
        isFinalStep={step === steps.length - 1}
        isNextBtnDisabled={isNextBtnDisabled}
        isSubmitting={isSubmitting}
      >
        <StepComponent />
      </OnBoardingLayout>
      <Alert
        state="default"
        title="회원가입이 완료되었어요!"
        infoText="회원가입이 완료되었습니다. 회원 승인 절차가 완료되면 정상적으로 SURF를 이용하실 수 있습니다."
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        actions={[
          {
            type: 'text',
            variant: 'primary',
            label: '확인',
            onClick: () => {
              setIsAlertOpen(false);
              router.push('/login');
            },
          },
        ]}
      />
    </>
  );
}
