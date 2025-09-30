import { useFormContext } from 'react-hook-form';
import { OnBoardingFormData } from '@/features/onboarding/model/types';

export function ProfileStep() {
  const { register } = useFormContext<OnBoardingFormData>();

  return (
    <div className="flex flex-col gap-4">
      <label>
        이름
        <input
          {...register('name', { required: '이름을 입력해주세요' })}
          className="border p-2"
          placeholder="이름을 입력하세요"
        />
      </label>
    </div>
    // <>
    //    <div className="flex items-center justify-center gap-[0.62rem] self-stretch pt-[2.5rem] pb-[0.62rem]">
    //       <ProfileImageUploader />
    //     </div>

    //     <div className="flex flex-col items-start gap-[0.62rem] self-stretch">
    //       <div className="flex flex-row">
    //         <span className="text-body-16-600--1 text-foreground-normal">이름</span>
    //         <span className="text-body-16-600--1 text-foreground-danger">*</span>
    //       </div>

    //       {/* 공통 컴포넌트 사용? */}
    //       <div className="flex flex-col items-start justify-center gap-[0.25rem] self-stretch">
    //         <input
    //           id="name"
    //           name="name"
    //           required
    //           aria-required="true"
    //           aria-describedby="name-help"
    //           autoComplete="name"
    //           placeholder="이름을 입력해주세요."
    //           value={data.name || ''}
    //           onChange={(e) => updateData({ name: e.target.value })}
    //           className="placeholder:text-foreground-hint text-foreground-normal bg-background-normal-darker flex flex-col items-start gap-[0.37rem] self-stretch rounded-[0.25rem] p-[0.62rem] focus:outline-none"
    //         />
    //         <span id="name-help" className="text-caption-10-400--1 text-foreground-normal">
    //           정확한 서비스 이용을 위해 실명을 기입해주세요
    //         </span>
    //       </div>
    //     </div>
    //   </div></>
  );
}
