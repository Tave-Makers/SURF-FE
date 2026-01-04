import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import OnBoardingLayout from './OnBoardingLayout';
import { ONBOARDING_EVENTS, OnBoardingFormData } from '@/features/onboarding/model/types';
import { ProfileStep } from '@/features/onboarding/ui/ProfileStep';
import { TrackUnivStep } from '@/features/onboarding/ui/TrackUnivStep';
import { EmailPhoneStep } from '@/features/onboarding/ui/EmailPhoneStep';
import { submitOnBoarding } from '@/features/onboarding/api/submitOnBoarding';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { DefaultError } from '@/shared/lib/handleApiError';
import { trackOnBoardingEvent } from '@/features/onboarding/lib/trackOnBoardingEvent';

const STEP_ANALYTICS_NAMES: Record<number, 'nickname' | 'track' | 'contact'> = {
  0: 'nickname',
  1: 'track',
  2: 'contact',
};

export default function OnBoardingForm() {
  const [step, setStep] = useState(0);
  const methods = useFormContext<OnBoardingFormData>();
  const router = useRouter();
  type StepConfig = {
    component: React.FC;
    title: string;
    description: string;
    fields: (keyof OnBoardingFormData)[];
  };

  const steps: StepConfig[] = [
    {
      component: ProfileStep,
      title: '프로필을 만들어봐요',
      description: '성함과 프로필 사진을 등록해주세요.',
      fields: ['name', 'profileImageUrl'],
    },
    {
      component: TrackUnivStep,
      title: '필수 정보를 입력해주세요.',
      description: '기존 TAVE 활동 정보를 입력해주세요.',
      fields: ['tracks', 'university', 'graduateSchool'],
    },
    {
      component: EmailPhoneStep,
      title: '필수 정보를 입력해주세요.',
      description: '기존 TAVE 활동 정보를 입력해주세요.',
      fields: ['email', 'phoneNumber'],
    },
  ];
  const StepComponent = steps[step].component;

  // step이 바뀔 때마다 signup_page_view 트래킹
  useEffect(() => {
    trackOnBoardingEvent(ONBOARDING_EVENTS.VIEW_SIGNUP_PAGE, {
      step: STEP_ANALYTICS_NAMES[step],
    });
  }, [step]);

  async function handleNext() {
    const isValid = await methods.trigger(steps[step].fields);
    if (!isValid) return;

    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      // 전체 값 제출
      await methods.handleSubmit(async (data) => {
        try {
          // 온보딩 제출 signup_submit 트래킹
          const filledCount = Object.values(data).filter(
            (v) =>
              v !== '' && //  빈 문자열이 아닌 경우는 제외
              v !== null && //  null이 아닌 경우는 제외
              !(Array.isArray(v) && v.length === 0), // 빈 배열([])인 경우는 제외
          ).length;

          trackOnBoardingEvent(ONBOARDING_EVENTS.SUBMIT_SIGNUP_FORM, {
            input_count: filledCount,
          });
          await submitOnBoarding(data);
          router.push(PAGE_ROUTES.HOME);
        } catch (error) {
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
            alert('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
          }
        }
      })();
    }
  }
  return (
    <OnBoardingLayout
      step={step}
      setStep={setStep}
      title={steps[step].title}
      description={steps[step].description}
      onNextBtnClick={() => {
        void handleNext();
      }}
      isFinalStep={step === steps.length - 1}
      isNextBtnDisabled={!methods.formState.isValid}
    >
      <StepComponent />
    </OnBoardingLayout>
  );
}
