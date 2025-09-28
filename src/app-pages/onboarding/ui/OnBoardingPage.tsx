import { SolidButton } from '@/shared/ui/solid-button/SolidButton';

export default function OnBoardingPage() {
  return (
    <>
      <div className="w-hull flex h-[20rem] flex-col px-[1rem]">
        <div className="flex flex-col gap-[0.25rem]">
          <div className="text-head-18-700--1 text-foreground-normal">
            필수 정보를 입력해주세요.
          </div>
          <div className="text-body-14-400--2-24 text-foreground-normal">
            기존 TAVE 활동 정보를 입력해주세요
          </div>
        </div>
        <div className="text-body-16-600--1 text-foreground-normal pt-[2.5rem]">
          <div>
            기수 및 파트<span className="text-foreground-danger">*</span>
          </div>
          <div>
            대학교<span className="text-foreground-danger">*</span>
          </div>
        </div>

        <SolidButton size="l" variant="primary" className="mt-auto mb-[1.25rem]">
          다음
        </SolidButton>
      </div>
    </>
  );
}
