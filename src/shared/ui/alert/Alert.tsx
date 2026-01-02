'use client';

import { useEffect, useId, useRef } from 'react';
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
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
};

export const Alert = ({
  state = 'default',
  title,
  infoText,
  actions,
  isOpen,
  onClose,
  closeOnBackdrop = true,
  closeOnEsc = true,
}: AlertProps) => {
  const uid = useId();
  const titleId = `${uid}-title`;
  const descId = infoText ? `${uid}-desc` : undefined;

  const dialogRef = useRef<HTMLElement | null>(null);
  const prevFocusedRef = useRef<HTMLElement | null>(null);

  const role = state === 'error' ? 'alertdialog' : 'dialog';

  useEffect(() => {
    if (!isOpen) return;

    prevFocusedRef.current = document.activeElement as HTMLElement | null;

    const el = dialogRef.current;
    el?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (!closeOnEsc) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      prevFocusedRef.current?.focus?.();
      prevFocusedRef.current = null;
    };
  }, [isOpen, onClose, closeOnEsc]);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 w-full bg-black/60"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden
      />

      <section
        ref={(node) => {
          dialogRef.current = node;
        }}
        tabIndex={-1}
        className={`bg-background-normal-lighter rounded-4 relative z-10 flex w-[17.1875rem] flex-col gap-14 overflow-hidden shadow-[0_0_2px_rgba(0,0,0,0.06),_0_3px_6px_rgba(0,0,0,0.12)] ${
          actions.length === 1 && actions[0].type === 'text' ? 'px-15 pt-15 pb-14' : 'p-15'
        }`}
        role={role}
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="flex flex-col gap-5">
          <span id={titleId} className="text-foreground-normal text-title-title2">
            {title}
          </span>
          {infoText && (
            <span id={descId} className="text-foreground-normal-lighter text-body-body9">
              {infoText}
            </span>
          )}
        </div>

        <div className="flex flex-row gap-8">
          {actions.map((action, idx) => {
            const isBtnSingle = actions.length === 1;

            const wrapperClass =
              action.type === 'text' && isBtnSingle ? 'ml-auto inline-flex w-auto' : 'flex-1';

            return (
              <div key={idx} className={wrapperClass}>
                {action.type === 'text' ? (
                  <TextButton
                    size="m"
                    variant={action.variant ?? 'primary'}
                    isDisabled={action.isDisabled}
                    onClick={action.onClick}
                    data-testid={action.testId}
                  >
                    {action.label}
                  </TextButton>
                ) : (
                  <SolidButton
                    size="m"
                    variant={action.variant ?? 'primary'}
                    isDisabled={action.isDisabled}
                    onClick={action.onClick}
                    data-testid={action.testId}
                  >
                    {action.label}
                  </SolidButton>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

Alert.displayName = 'Alert';
