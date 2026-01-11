import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { OnBoardingFormData } from '@/features/onboarding/model/types';
import { ProfileImageUploader } from '@/features/profile/ui/upload-profile-image/ProfileImageUploader';
import { TextArea } from '@surf/ui/text-area';
import { FieldGroup } from '@surf/ui/field-group';

export function ProfileStep() {
  const { control } = useFormContext<OnBoardingFormData>();
  const profileImageUrl = useWatch({
    control,
    name: 'profileImageUrl',
  });

  return (
    <>
      {/* 프로필 이미지 업로더 */}
      <div className="flex items-center justify-center gap-10 self-stretch pt-19 pb-10">
        <Controller
          name="profileImage"
          control={control}
          render={({ field }) => (
            <ProfileImageUploader
              file={field.value}
              onChange={field.onChange}
              initialImageUrl={profileImageUrl}
            />
          )}
        />
      </div>

      {/* 이름 입력 */}
      <div className="flex w-full flex-col items-start gap-10 self-stretch">
        <FieldGroup title="이름" isRequired className="w-full">
          <Controller
            name="name"
            control={control}
            rules={{
              required: '이름은 필수 입력값입니다.',
              minLength: { value: 2, message: '이름은 최소 2자 이상이어야 합니다.' },
            }}
            render={({ field, fieldState }) => (
              <TextArea
                {...field}
                value={field.value || ''}
                placeholder="이름을 입력해주세요."
                autoComplete="name"
                guideMessage="정확한 서비스 이용을 위해 실명을 기입해주세요"
                errorMessage={fieldState.error?.message}
              />
            )}
          />
        </FieldGroup>
      </div>
    </>
  );
}
