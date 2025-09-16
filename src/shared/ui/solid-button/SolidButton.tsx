'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type ButtonSize = 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning';

type SolidButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size: ButtonSize;
  variant: ButtonVariant;
  leftIconName?: SurfIconName | null;
  rightIconName?: SurfIconName | null;
  children: ReactNode;
};

export default forwardRef<HTMLButtonElement, SolidButtonProps>(function SolidButton(
  {
    size = 'm',
    variant = 'primary',
    disabled = false,
    leftIconName,
    rightIconName,
    children,
    type = 'button',
    onClick,
    ...rest
  },
  ref,
) {
  const sizeHeightMap: Record<ButtonSize, string> = {
    s: 'h-[2rem]',
    m: 'h-[2.5rem]',
    l: 'h-[3rem]',
  };

  const sizeTextMap: Record<ButtonSize, string> = {
    s: 'text-body-14-600--1-20',
    m: 'text-body-16-600--1',
    l: 'text-body-16-600--1',
  };

  const variantMap: Record<ButtonVariant, string> = {
    primary: 'text-foreground-accent bg-background-primary hover:bg-foreground-primary',
    secondary: 'text-foreground-normal bg-background-tertiary hover:bg-background-quaternary',
    danger: 'text-foreground-accent bg-foreground-danger hover:bg-foreground-danger-darker',
    warning: 'text-foreground-danger bg-background-tertiary hover:bg-background-quaternary',
  };

  const disabledClass =
    'bg-background-tertiary text-foreground-accent cursor-not-allowed opacity-50';

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      onClick={onClick}
      {...rest}
      className={[
        'inline-flex w-full items-center justify-center gap-[0.62rem] rounded px-[0.75rem] py-[0.62rem]',
        sizeHeightMap[size],
        sizeTextMap[size],
        disabled ? disabledClass : variantMap[variant],
      ].join(' ')}
    >
      {leftIconName && <SurfIcon name={leftIconName} size={size} />}
      {children && <span>{children}</span>}
      {rightIconName && <SurfIcon name={rightIconName} size={size} />}
    </button>
  );
});
