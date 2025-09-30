// 'use client';
// import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
// import { TrackUnivForm } from '@/widgets/onboarding-form/ui/OnBoardingForm';

// export default function OnBoardingPage() {

//   return (
//     <>
//       <div className="flex h-full w-full flex-col px-[1rem]">
//         <div className="flex-1">
//           <div className="flex flex-col gap-[0.25rem]">
//             <div className="text-head-18-700--1 text-foreground-normal">
//               필수 정보를 입력해주세요.
//             </div>
//             <div className="text-body-14-400--2-24 text-foreground-normal">
//               기존 TAVE 활동 정보를 입력해주세요
//             </div>
//           </div>
//           <div className="flex flex-col gap-[1.5rem] pt-[2.5rem]">
//             <TrackUnivForm />
//           </div>
//         </div>

//         <SolidButton size="l" variant="primary" className="mt-auto mb-[1.25rem]">
//           다음
//         </SolidButton>
//       </div>
//     </>
//   );
// }
'use client';

import { OnBoardingFormData } from '@/features/onboarding/model/types';
import OnBoardingForm from '@/widgets/onboarding/ui/OnBoardingForm';
import { FormProvider, useForm } from 'react-hook-form';

export default function OnBoardingPage() {
  const methods = useForm<OnBoardingFormData>({
    defaultValues: {
      name: '',
      profileImageUrl: '',
      tracks: [{ period: '', part: '' }],
      university: '',
      gradSchool: '',
      email: '',
      phoneNumber: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return (
    <FormProvider {...methods}>
      <OnBoardingForm />
    </FormProvider>
  );
}
