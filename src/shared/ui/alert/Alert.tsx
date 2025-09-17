'use client';

import SolidButton, { SolidButtonProps } from '../solid-button/SolidButton';
import TextButton, { TextButtonProps } from '../text-button/TextButton';

type AlertState = 'default' | 'error';

type AlertProps = {
  state: AlertState;
  title: string;
  infoText?: string;
  hasTwoBtn?: boolean;
  rightBtnText: string;
  leftBtnText?: string;
  rightSolidButtonVariant?: SolidButtonProps['variant'];
  leftSolidButtonVariant?: SolidButtonProps['variant'];
  textButtonVariant?: TextButtonProps['variant'];
  onRightBtnClick?: () => void;
  onLeftBtnClick?: () => void;
};

export default function Alert({
  state = 'default',
  title,
  infoText,
  hasTwoBtn = true,
  rightBtnText = '확인',
  leftBtnText = '취소',
  rightSolidButtonVariant,
  leftSolidButtonVariant,
  textButtonVariant,
  onRightBtnClick,
  onLeftBtnClick,
}: AlertProps) {
  if (state === 'error') {
    hasTwoBtn = false;

    return (
      <section className="bg-background-normal flex w-[15.93rem] flex-col gap-[1rem] overflow-hidden rounded-[0.5rem] px-[1.25rem] pt-[1.25rem] pb-[1rem]">
        <div className="flex flex-col gap-[0.25rem]">
          <span className="text-foreground-normal text-body-16-600--1">{title}</span>
          <span className="text-foreground-normal-darker text-body-14-400--2-22">{infoText}</span>
        </div>
        <div className="flex flex-row justify-end gap-2">
          <TextButton
            size="m"
            variant={textButtonVariant ?? 'primary'}
            onClick={onRightBtnClick}
            className="ml-auto !inline-flex !w-auto"
          >
            {rightBtnText}
          </TextButton>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-background-normal flex w-[15.93rem] flex-col gap-[1rem] rounded-[0.5rem] px-[1.25rem] pt-[1.25rem] pb-[1rem]">
      <div className="flex flex-col gap-[0.25rem]">
        <span className="text-foreground-normal text-body-16-600--1">{title}</span>
        <span className="text-foreground-normal-darker text-body-14-400--2-22">{infoText}</span>
      </div>
      <div className="flex flex-row justify-end gap-2">
        {hasTwoBtn && (
          <SolidButton
            size="m"
            variant={leftSolidButtonVariant ?? 'secondary'}
            onClick={onLeftBtnClick}
          >
            {leftBtnText}
          </SolidButton>
        )}
        <SolidButton
          size="m"
          variant={rightSolidButtonVariant ?? 'primary'}
          onClick={onRightBtnClick}
        >
          {rightBtnText}
        </SolidButton>
      </div>
    </section>
  );
}
