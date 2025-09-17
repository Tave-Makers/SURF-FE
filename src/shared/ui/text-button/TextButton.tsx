'use client';

import type { ComponentProps, ButtonHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type ButtonSize = 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'warning';

export type TextButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  size: ButtonSize;
  variant: ButtonVariant;
  leftIconName?: SurfIconName | null;
  rightIconName?: SurfIconName | null;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      size = 'm',
      variant = 'primary',
      disabled = false,
      leftIconName,
      rightIconName,
      children,
      type = 'button',
      onClick,
      className,
      ...rest
    },
    ref,
  ) => {
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
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        {...rest}
        className={[
          'inline-flex w-full items-center justify-center overflow-hidden px-[0.75rem] py-[0.62rem]',
          sizeHeightMap[size],
          sizeTextMap[size],
          disabled ? disabledMap[variant] : [variantMap[variant], 'cursor-pointer'],
          className,
        ].join(' ')}
      >
        {leftIconName && (
          <SurfIcon name={leftIconName} size={size} className="h-[1.5rem] w-[1.5rem]" />
        )}
        <div className="h-[1.5rem] w-[0.25rem]"></div>
        {children && <span>{children}</span>}
        <div className="h-[1.5rem] w-[0.25rem]"></div>
        {rightIconName && (
          <SurfIcon name={rightIconName} size={size} className="h-[1.5rem] w-[1.5rem]" />
        )}
      </button>
    );
  },
);

TextButton.displayName = 'TextButton';
