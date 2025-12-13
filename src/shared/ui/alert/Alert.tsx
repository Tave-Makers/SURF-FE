'use client';
import { useId } from 'react';

import { SolidButton, SolidButtonProps } from '../button/solid-button/SolidButton';
import { TextButton, TextButtonProps } from '../button/text-button/TextButton';

type BaseAction = {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  testId?: string;
};

type SolidAction = BaseAction & {
  type: 'solid';
  variant?: SolidButtonProps['variant']; // primary | secondary | danger | warning
};

type TextAction = BaseAction & {
  type: 'text';
  variant?: TextButtonProps['variant']; // primary | secondary | warning
};

type AlertAction = SolidAction | TextAction;
type AlertState = 'default' | 'error';

type AlertProps = {
  state: AlertState;
  title: string;
  infoText?: string;
  actions: AlertAction[];
  isOpen: boolean;
  onClose: () => void;
};

export const Alert = ({
  state = 'default',
  title,
  infoText,
  actions,
  isOpen,
  onClose,
}: AlertProps) => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = infoText ? `${uid}-desc` : undefined;

  const isError = state === 'error';

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 w-full bg-black/60" onClick={onClose} aria-hidden />
      <section
        // 버튼이 1개일 때 && 버튼 종류가 textbutton일 때: px-15, pt-15, pb-14 로 설정
        className={`bg-background-normal-lighter rounded-4 relative z-10 flex w-[17.18rem] flex-col gap-14 overflow-hidden ${
          actions.length === 1 && actions[0].type === 'text' ? 'px-15 pt-15 pb-14' : 'p-15'
        }`}
        role={isError ? 'alert' : undefined}
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="flex flex-col gap-5">
          <span id={titleId} className="text-foreground-foreground-normal text-title-title2">
            {title}
          </span>
          {infoText && (
            <span id={descId} className="text-foreground-foreground-normal-lighter text-body-body8">
              {infoText}
            </span>
          )}
        </div>

        <div className="flex flex-row gap-8">
          {actions.map((action, idx) => {
            const isBtnSingle = actions.length === 1;
            const wrapperClass =
              action.type === 'text' && isBtnSingle ? 'ml-auto inline-flex w-auto' : 'flex-1';

            if (action.type === 'text') {
              return (
                <div key={idx} className={wrapperClass}>
                  <TextButton
                    size="m"
                    variant={action.variant ?? 'primary'}
                    isDisabled={action.isDisabled}
                    onClick={action.onClick}
                    data-testid={action.testId}
                  >
                    {action.label}
                  </TextButton>
                </div>
              );
            }

            // type === 'solid'
            return (
              <SolidButton
                key={idx}
                size="m"
                variant={action.variant ?? 'primary'}
                isDisabled={action.isDisabled}
                onClick={action.onClick}
                data-testid={action.testId}
              >
                {action.label}
              </SolidButton>
            );
          })}
        </div>
      </section>
    </div>
  );
};

Alert.displayName = 'Alert';
