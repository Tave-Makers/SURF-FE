import { FieldGroup } from '@surf/ui/field-group';
import { TextArea } from '@surf/ui/text-area';
import { Controller, useFormContext } from 'react-hook-form';
import { trackOnBoardingEvent } from '../lib/trackOnBoardingEvent';
import { isValidPhoneNumber, PHONE_NUMBER_ERROR_MESSAGE } from '@/entities/user/lib/phoneNumber';
import { ONBOARDING_EVENTS, OnBoardingFormData } from '@/features/onboarding/model/types';
import { formatPhoneNumber, onlyDigits } from '@/shared/lib/phoneNumber';

export const EmailPhoneStep = () => {
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
      <FieldGroup title="전화번호">
        <Controller
          control={control}
          name="phoneNumber"
          rules={{
            // 선택 입력이므로 값이 있을 때만 형식을 본다 (pattern은 빈 문자열도 거른다)
            validate: (value) => isValidPhoneNumber(value) || PHONE_NUMBER_ERROR_MESSAGE,
          }}
          render={({ field, fieldState }) => (
            <TextArea
              id={field.name}
              mode="oneLine"
              value={formatPhoneNumber(field.value ?? '')}
              onChange={(v) => field.onChange(onlyDigits(v))}
              onBlur={field.onBlur}
              placeholder="01012345678"
              errorMessage={fieldState.error?.message}
              guideMessage="정확한 전화번호를 숫자만 입력해주세요."
            />
          )}
        />
      </FieldGroup>
    </>
  );
};
