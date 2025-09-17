'use client';

import SolidButton, { SolidButtonProps } from '../solid-button/SolidButton';
import TextButton, { TextButtonProps } from '../text-button/TextButton';

type AlertState = 'default' | 'error';

type AlertProps = {
  state: AlertState;
  title: string;
  infoText?: string;
  hasTwoBtn: boolean;
  rightBtnText: string;
  leftBtnText?: string;
  rightSolidButtonVariant?: SolidButtonProps['variant'];
  leftSolidButtonVariant?: SolidButtonProps['variant'];
  textButtonVariant?: TextButtonProps['variant'];
  onRightBtnClick: () => void;
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
  const isError = state === 'error';
  const showTwo = !isError && hasTwoBtn;

  return (
    <section
      className="bg-background-normal flex w-[17.18rem] flex-col gap-[1rem] overflow-hidden rounded-[0.5rem] px-[1.25rem] pt-[1.25rem] pb-[1rem]"
      role={isError ? 'alert' : undefined}
      aria-labelledby="alert-title"
      aria-describedby={infoText ? 'alert-desc' : undefined}
    >
      <div className="flex flex-col gap-[0.25rem]">
        <span id="alert-title" className="text-foreground-normal text-body-16-600--1">
          {title}
        </span>
        {infoText && (
          <span id="alert-desc" className="text-foreground-normal-darker text-body-14-400--2-22">
            {infoText}
          </span>
        )}
      </div>

      <div className="flex flex-row justify-end gap-2">
        {isError ? (
          <TextButton
            size="m"
            variant={textButtonVariant ?? 'primary'}
            onClick={onRightBtnClick}
            className="ml-auto !inline-flex !w-auto"
          >
            {rightBtnText}
          </TextButton>
        ) : (
          <>
            {showTwo && (
              <SolidButton
                size="m"
                variant={leftSolidButtonVariant ?? 'secondary'}
                onClick={onLeftBtnClick ?? undefined}
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
          </>
        )}
      </div>
    </section>
  );
}
