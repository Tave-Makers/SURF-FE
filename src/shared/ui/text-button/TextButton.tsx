'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type ButtonSize = 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'warning';

type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size: ButtonSize;
  variant: ButtonVariant;
  disabled?: boolean;
  leftIconName?: SurfIconName | null;
  rightIconName?: SurfIconName | null;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
};

export default forwardRef<HTMLButtonElement, TextButtonProps>(function TextButton({
  size = 'm',
  variant = 'primary',
  disabled = false,
  leftIconName,
  rightIconName,
  children,
  type = 'button',
  onClick,
  ...rest
}: TextButtonProps) {
  const sizeHeightMap: Record<ButtonSize, string> = {
    s: 'h-8',
    m: 'h-10',
    l: 'h-12',
  };

  const sizeTextMap: Record<ButtonSize, string> = {
    s: 'text-body-14-600--1-20',
    m: 'text-body-16-600--1',
    l: 'text-body-16-600--1',
  };

  const variantMap: Record<ButtonVariant, string> = {
    primary: 'text-background-primary hover:text-foreground-primary',
    secondary: 'text-foreground-normal-darker hover:text-foreground-normal',
    warning: 'text-foreground-danger hover:text-foreground-danger-darker',
  };

  const disabledMap: Record<ButtonVariant, string> = {
    primary: 'text-foreground-primary cursor-not-allowed opacity-30',
    secondary: 'text-foreground-normal-darker cursor-not-allowed opacity-30',
    warning: 'text-foreground-danger cursor-not-allowed opacity-30',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      className={[
        'inline-flex w-full items-center justify-center gap-1 px-3 py-2.5',
        sizeHeightMap[size],
        sizeTextMap[size],
        disabled ? disabledMap[variant] : variantMap[variant],
      ].join(' ')}
    >
      {leftIconName && <SurfIcon name={leftIconName} size={size} />}
      <span>{children}</span>
      {rightIconName && <SurfIcon name={rightIconName} size={size} />}
    </button>
  );
});
