'use client';
import { SolidButton } from '@surf/ui/button';

import { FieldGroup } from '@surf/ui/field-group';
import { Input } from '@surf/ui/input';

import { Controller, useForm } from 'react-hook-form';
import { FormValues } from '../model/types';

export const LoginForm = () => {
  const {
    control,
    handleSubmit,

    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: false,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    const { email, password } = values;
    console.log(email, password);
  };
  return (
    <form
      className="flex w-full flex-col justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      aria-label="어드민 로그인 폼"
    >
      <div className="flex w-full flex-col gap-16 pb-16">
        <FieldGroup title="이메일" isRequired className="w-full">
          <Controller
            control={control}
            name="email"
            rules={{
              required: '이메일은 필수예요.',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: '올바른 이메일을 입력해주세요.',
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="email@example.com"
                errorMessage={errors.email?.message}
                autoComplete="username"
              />
            )}
          />
        </FieldGroup>
        <FieldGroup title="Admin 비밀번호" isRequired>
          <Controller
            control={control}
            name="password"
            rules={{
              required: '비밀번호는 필수예요.',
            }}
            render={({ field }) => (
              <Input
                {...field}
                name="password"
                type="password"
                placeholder="비밀번호를 입력해주세요."
                autoComplete="current-password"
                errorMessage={errors.password?.message}
              />
            )}
          />
        </FieldGroup>
      </div>
      <SolidButton
        type="submit"
        variant="primary"
        size="l"
        className="absolute bottom-[1.25rem] left-1/2 -translate-x-1/2"
        isDisabled={!isValid}
      >
        로그인
      </SolidButton>
    </form>
  );
};
