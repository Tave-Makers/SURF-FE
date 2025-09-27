'use client';

// import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/entities/user/model/onboardingStore';
import { ProfileImageUploader } from '@/features/user/upload-profile-image/ui/ProfileImageUploader';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';

export const ProfileForm = () => {
  //   const router = useRouter();
  const { data, updateData } = useOnboardingStore();

  //   const isNextDisabled = !data.name || !data.profileImage;

  const handleNext = () => {
    // 다음 온보딩 단계로 이동
    // router.push('/onboarding/');
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-start self-stretch pb-[21.72rem]">
        <div className="flex flex-col items-start gap-[0.25rem] self-stretch">
          {/* 아래 태그들 글자색 바꿔야 함 */}
          <div className="text-head-18-700--1 self-stretch text-[#202020]">프로필을 만들어봐요</div>
          <div className="text-body-14-400--2-24 text-[#202020]">
            성함과 프로필 사진을 등록해주세요.
          </div>
        </div>

        <div className="flex items-center justify-center gap-[0.62rem] self-stretch pt-[2.5rem] pb-[0.62rem]">
          <ProfileImageUploader />
        </div>

        <div className="flex flex-col items-start gap-[0.62rem] self-stretch">
          <div className="flex flex-row">
            <span className="text-body-16-600--1 text-foreground-normal">이름</span>
            <span className="text-body-16-600--1 text-foreground-danger">*</span>
          </div>

          {/* 셀렉트 필드 공통 컴포넌트 들어갈자리 */}
          <div className="flex flex-col items-start justify-center gap-[0.25rem] self-stretch">
            <input
              id="name"
              name="name"
              required
              aria-required="true"
              aria-describedby="name-help"
              autoComplete="name"
              placeholder="이름을 입력해주세요."
              value={data.name || ''}
              onChange={(e) => updateData({ name: e.target.value })}
              className="placeholder:text-foreground-hint text-foreground-normal bg-background-normal-darker flex flex-col items-start gap-[0.37rem] self-stretch rounded-[0.25rem] p-[0.62rem] focus:outline-none"
            />
            <span id="name-help" className="text-caption-10-400--1 text-foreground-normal">
              정확한 서비스 이용을 위해 실명을 기입해주세요
            </span>
          </div>
        </div>
      </div>

      <div className="items-start gap-[0.62rem] pt-[1rem] pb-[1.25rem]">
        <SolidButton
          size="l"
          variant="primary"
          onClick={handleNext}
          // isDisabled={isNextDisabled}
        >
          다음
        </SolidButton>
      </div>
    </div>
  );
};
