'use client';
import { SolidButton } from '@surf/ui/button';

import { FieldGroup } from '@surf/ui/field-group';
import { Input } from '@surf/ui/input';

import { useToastStore } from '@surf/ui/store/toastStore';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { login } from '../api/login';
import { FormValues } from '../model/types';
import { PAGE_ROUTES } from '@/shared/config/path';
import { handleApiError } from '@/shared/lib/handleApiError';

export const LoginForm = () => {
  const router = useRouter();

  const toast = useToastStore((s) => s.show);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const onSubmit = async (values: FormValues) => {
    if (isLoading) return;

    const { email, password } = values;
    setIsLoading(true);
    try {
      await login({ email, password });
      router.push(PAGE_ROUTES.HOME);
    } catch (e) {
      const error = handleApiError(e, '로그인 중 알 수 없는 오류가 발생했습니다.');
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      className="flex w-full flex-col justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        void handleSubmit(onSubmit)(e);
      }}
      aria-label="게스트 로그인 폼"
    >
      <div className="flex w-full flex-col gap-16">
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
        <FieldGroup title="비밀번호" isRequired>
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
        className="absolute bottom-15 left-1/2 -translate-x-1/2"
        isDisabled={!isValid}
      >
        로그인
      </SolidButton>
    </form>
  );
};
