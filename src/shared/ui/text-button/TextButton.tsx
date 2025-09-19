'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type ButtonSize = 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'warning';

export type TextButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled' | 'className'
> & {
  size: ButtonSize;
  variant: ButtonVariant;
  isDisabled?: boolean;
  leftIconName?: SurfIconName | null;
  rightIconName?: SurfIconName | null;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const TextButton = forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      size = 'm',
      variant = 'primary',
      isDisabled = false,
      leftIconName,
      rightIconName,
      children,
      type = 'button',
      onClick,
      ...rest
    },
    ref,
  ) => {
    const sizeHeightMap: Record<ButtonSize, string> = {
      s: 'h-[2rem]',
      m: 'h-[2.5rem]',
      l: 'h-[3rem]',
    };

    const sizePaddingMap: Record<ButtonSize, string> = {
      s: 'px-[0.25rem] py-[0.38rem]',
      m: 'px-[0.5rem] py-[0.56rem]',
      l: 'px-[0.75rem] py-[0.75rem]',
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

    const baseClass = 'inline-flex w-full items-center justify-center overflow-hidden rounded';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
        className={[
          baseClass,
          sizePaddingMap[size],
          sizeHeightMap[size],
          sizeTextMap[size],
          isDisabled ? disabledMap[variant] : `${variantMap[variant]} cursor-pointer`,
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
