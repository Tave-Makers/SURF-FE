import { useAlertStore } from '@surf/ui/store/alertStore';
import { safeUUID } from '@surf/utils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { OnBoardingLayout } from './OnBoardingLayout';
import { useImageUploader } from '@/entities/image/model/useImageUploader';
import { isValidPhoneNumber } from '@/entities/user/lib/phoneNumber';
import { useAccountIntegrationFlow } from '@/features/account-integration';
import { useAgreementStore } from '@/features/laws/model/useAgreementStore';
import { submitOnBoarding } from '@/features/onboarding/api/submitOnBoarding';
import { isAccountIntegrationRequiredError } from '@/features/onboarding/lib/accountIntegrationError';
import { trackOnBoardingEvent } from '@/features/onboarding/lib/trackOnBoardingEvent';
import { ONBOARDING_EVENTS, OnBoardingFormData } from '@/features/onboarding/model/types';
import { EmailPhoneStep } from '@/features/onboarding/ui/EmailPhoneStep';
import { ProfileStep } from '@/features/onboarding/ui/ProfileStep';
import { TrackUnivStep } from '@/features/onboarding/ui/TrackUnivStep';
import { PAGE_ROUTES } from '@/shared/config/path';

const STEP_ANALYTICS_NAMES: Record<number, 'nickname' | 'track' | 'contact'> = {
  0: 'nickname',
  1: 'track',
  2: 'contact',
};

interface OnBoardingFormProps {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

export const OnBoardingForm = ({ step, setStep }: OnBoardingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const methods = useFormContext<OnBoardingFormData>();
  const router = useRouter();
  const { start: startAccountIntegration } = useAccountIntegrationFlow();
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
  // 전화번호는 선택 입력 — 비워두거나, 채웠다면 형식이 맞아야 한다.
  // 필드 규칙과 같은 정규식을 써야 버튼만 활성화되고 trigger에서 막히는 일이 없다.
  const isValidPhone = isValidPhoneNumber(watchedPhoneNumber);

  // '추가하기'는 빈 행을 먼저 붙이므로, 하나라도 미완성이면 진행을 막아야 한다.
  // some()이면 빈 행이 남은 채 통과해 서버가 tracks[n].part=null 로 400을 낸다.
  const hasValidTrack =
    Array.isArray(watchedTracks) &&
    watchedTracks.length > 0 &&
    watchedTracks.every((t) => t?.generation != null && t?.part != null);

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

    // 선택 입력이므로 비어 있으면 키 자체를 보내지 않는다.
    // 대학원은 체크박스만 켜고 비워둘 수 있어 빈 문자열이 실려 나갈 수 있다.
    if (!submitData.phoneNumber?.trim()) delete submitData.phoneNumber;
    if (!submitData.graduateSchool?.trim()) delete submitData.graduateSchool;

    const filledCount = Object.values(submitData).filter(
      (v) => v !== '' && v !== null && !(Array.isArray(v) && v.length === 0),
    ).length;

    trackOnBoardingEvent(ONBOARDING_EVENTS.SUBMIT_SIGNUP_FORM, {
      input_count: filledCount,
    });
    await submitOnBoarding(submitData);
    useAgreementStore.getState().resetAgreements();

    openAlert({
      state: 'default',
      title: '회원가입이 완료되었어요!',
      infoText:
        '회원가입이 완료되었습니다. 회원 승인 절차가 완료되면 정상적으로 SURF를 이용하실 수 있습니다.',
      actions: [
        {
          type: 'text',
          variant: 'primary',
          label: '확인',
          onClick: () => {
            closeAlert({ restoreFocus: false });
            router.replace(PAGE_ROUTES.LOGIN);
          },
        },
      ],
    });
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
      // 이동은 onSubmit 성공 알럿에서만 처리한다.
      // handleSubmit 은 검증 실패 시 throw 하지 않고 조용히 끝나므로,
      // 여기서 이동시키면 가입 요청 없이도 화면이 넘어간다.
      await methods.handleSubmit(onSubmit)();
    } catch (error) {
      // 이메일·전화번호가 모두 기존 회원과 일치 -> 계정 통합 플로우
      if (isAccountIntegrationRequiredError(error)) {
        await startAccountIntegration(error.integrationToken);
        return;
      }

      if (error instanceof Error && error.message === 'PROFILE_IMAGE_UPLOAD_FAILED') {
        openAlert({
          title: '업로드 실패',
          infoText: '프로필 이미지 업로드에 실패했습니다.',
          actions: [{ type: 'text', label: '확인', onClick: closeAlert }],
        });
        return;
      }

      // submitOnBoarding 은 handleApiError 로 서버 메시지를 담은 Error 를 던진다.
      // (예: 409 ACCOUNT_CONFLICT_BLOCKED → "이미 사용 중인 [이메일]입니다.")
      // 사용자가 입력값을 고쳐야 하는 경우가 대부분이므로 화면 이동 없이 안내만 한다.
      if (error instanceof Error && error.message) {
        openAlert({
          title: '오류',
          infoText: error.message,
          actions: [{ type: 'text', label: '확인', onClick: closeAlert }],
        });
      } else {
        openAlert({
          title: '오류',
          infoText: '네트워크 오류가 발생했습니다.',
          actions: [{ type: 'text', label: '확인', onClick: closeAlert }],
        });
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
    </>
  );
};
