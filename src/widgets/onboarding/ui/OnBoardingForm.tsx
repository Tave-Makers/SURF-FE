import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import OnBoardingLayout from './OnBoardingLayout';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import { ProfileStep } from '@/features/onboarding/ui/ProfileStep';
import { TrackUnivStep } from '@/features/onboarding/ui/TrackUnivStep';
import { EmailPhoneStep } from '@/features/onboarding/ui/EmailPhoneStep';

export default function OnBoardingForm() {
  const [step, setStep] = useState(0);
  const methods = useFormContext<OnBoardingFormData>();
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
      fields: ['tracks', 'university', 'gradSchool'],
    },
    {
      component: EmailPhoneStep,
      title: '필수 정보를 입력해주세요.',
      description: '기존 TAVE 활동 정보를 입력해주세요.',
      fields: ['email', 'phoneNumber'],
    },
  ];
  const StepComponent = steps[step].component;

  async function handleNext() {
    const isValid = await methods.trigger(steps[step].fields);

    if (!isValid) return;

    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // 전체 값 제출
      await methods.handleSubmit((data) => {
        // 여기서 최종 데이터 확인 가능
        console.log('최종 온보딩 데이터:', data);
        alert(JSON.stringify(data, null, 2)); // 확인용
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
