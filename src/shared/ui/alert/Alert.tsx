'use client';
import { useId } from 'react';

import { SolidButton, SolidButtonProps } from '../solid-button/SolidButton';
import { TextButton, TextButtonProps } from '../text-button/TextButton';

type BaseAction = {
  label: string;
  onClick: () => void;
  isDisabled?: boolean;
  className?: string;
  testId?: string;
};

type SolidAction = BaseAction & {
  type: 'solid';
  variant?: SolidButtonProps['variant'];
};

type TextAction = BaseAction & {
  type: 'text';
  variant?: TextButtonProps['variant'];
};

type AlertAction = SolidAction | TextAction;
type AlertState = 'default' | 'error';

type AlertProps = {
  state: AlertState;
  title: string;
  infoText?: string;
  actions: AlertAction[];
};

export const Alert = ({ state = 'default', title, infoText, actions }: AlertProps) => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = infoText ? `${uid}-desc` : undefined;

  const isError = state === 'error';

  return (
    <section
      className="bg-background-normal flex w-[17.18rem] flex-col gap-[1rem] overflow-hidden rounded-[0.5rem] px-[1.25rem] pt-[1.25rem] pb-[1rem]"
      role={isError ? 'alert' : undefined}
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className="flex flex-col gap-[0.25rem]">
        <span id={titleId} className="text-foreground-normal text-body-16-600--1">
          {title}
        </span>
        {infoText && (
          <span id={descId} className="text-foreground-normal-darker text-body-14-400--2-22">
            {infoText}
          </span>
        )}
      </div>

      <div className="flex flex-row justify-end gap-2">
        {actions.map((action, idx) => {
          if (action.type === 'text') {
            return (
              <TextButton
                key={idx}
                size="m"
                variant={action.variant ?? 'primary'}
                isDisabled={action.isDisabled}
                onClick={action.onClick}
                className={action.className ?? 'ml-auto !inline-flex !w-auto'}
                data-testid={action.testId}
              >
                {action.label}
              </TextButton>
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
  );
};

Alert.displayName = 'Alert';
