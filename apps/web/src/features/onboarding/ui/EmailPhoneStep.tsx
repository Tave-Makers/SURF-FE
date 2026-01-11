import { Controller, useFormContext } from 'react-hook-form';
import { ONBOARDING_EVENTS, OnBoardingFormData } from '@/features/onboarding/model/types';
import { FieldGroup } from '@surf/ui/field-group';
import { TextArea } from '@surf/ui/text-area';
import { trackOnBoardingEvent } from '../lib/trackOnBoardingEvent';

export function EmailPhoneStep() {
  const { control } = useFormContext<OnBoardingFormData>();
  return (
    <>
      <FieldGroup title="이메일" isRequired>
        <Controller
          name="email"
          control={control}
          rules={{
            required: '이메일은 필수 입력값입니다.',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: '유효한 이메일 주소를 입력해주세요.',
            },
          }}
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              onBlur={(_e) => {
                trackOnBoardingEvent(ONBOARDING_EVENTS.INPUT_SIGNUP_FIELD, {
                  field_name: 'email',
                });
                field.onBlur();
              }}
              value={field.value || ''}
              errorMessage={fieldState.error?.message}
              placeholder="이메일을 입력해주세요."
              guideMessage="정확한 이메일을 입력해주세요."
            />
          )}
        />
      </FieldGroup>
      <FieldGroup title="전화번호" isRequired>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: '전화번호는 필수 입력값입니다.',
            pattern: {
              value: /^[0-9]{10,11}$/,
              message: '10~11 자리 숫자만 입력해주세요.',
            },
          }}
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              onBlur={(_e) => {
                trackOnBoardingEvent(ONBOARDING_EVENTS.INPUT_SIGNUP_FIELD, {
                  field_name: 'phone',
                });
                field.onBlur();
              }}
              value={field.value || ''}
              errorMessage={fieldState.error?.message}
              placeholder="전화번호를 입력해주세요."
              guideMessage="정확한 전화번호를 입력해주세요."
            />
          )}
        />
      </FieldGroup>
    </>
  );
}
