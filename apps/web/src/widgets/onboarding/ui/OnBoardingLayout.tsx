'use client';

import { SolidButton } from '@surf/ui/button';
import React from 'react';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
type OnBoardingLayoutProps = {
  step: number;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  title: string;
  description: string;
  children: React.ReactNode;
  onNextBtnClick: () => void;
  isNextBtnDisabled?: boolean;
  isFinalStep?: boolean;
  isSubmitting?: boolean;
};
export const OnBoardingLayout = ({
  step,
  setStep,
  title,
  description,
  children,
  onNextBtnClick,
  isNextBtnDisabled = true,
  isFinalStep = false,
  isSubmitting,
}: OnBoardingLayoutProps) => {
  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader
        customBack={() => {
          if (step === 0) {
            // 로그인으로 이동
            window.location.href = '/login';
          } else {
            // 이전 스텝으로
            setStep((prev) => prev - 1);
          }
        }}
      />
      <div className="flex h-full w-full flex-col px-[1rem]">
        <div className="flex-1">
          {/* 안내 문구 */}
          <div className="flex flex-col gap-[0.25rem]">
            <div className="text-title-title1 text-foreground-normal">{title}</div>{' '}
            <div className="text-body-body9 text-foreground-normal">{description}</div>{' '}
          </div>
          <div className="flex flex-col gap-[1.5rem] pt-[2.5rem]">{children}</div>{' '}
        </div>
        {/* 하단 버튼 */}
        <SolidButton
          size="l"
          variant="primary"
          className="mt-auto mb-[1.25rem]"
          onClick={onNextBtnClick}
          isDisabled={isNextBtnDisabled || isSubmitting}
        >
          {isSubmitting ? '처리 중...' : isFinalStep ? '가입완료' : '다음'}
        </SolidButton>
      </div>
    </div>
  );
};
