'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type ButtonSize = 's' | 'm' | 'l';
type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'warning';

export type SolidButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  size: ButtonSize;
  variant: ButtonVariant;
  isDisabled?: boolean;
  leftIconName?: SurfIconName | null;
  rightIconName?: SurfIconName | null;
  children: ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const SolidButton = forwardRef<HTMLButtonElement, SolidButtonProps>(
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
      primary: 'text-foreground-accent bg-background-primary hover:bg-foreground-primary',
      secondary: 'text-foreground-normal bg-background-tertiary hover:bg-background-quaternary',
      danger: 'text-foreground-accent bg-foreground-danger hover:bg-foreground-danger-darker',
      warning: 'text-foreground-danger bg-background-tertiary hover:bg-background-quaternary',
    };

    const disabledClass =
      'bg-background-tertiary text-foreground-accent cursor-not-allowed opacity-50';

    const baseClass =
      'inline-flex w-full items-center justify-center overflow-hidden rounded px-[0.75rem] py-[0.62rem]';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
        className={[
          baseClass,
          sizeHeightMap[size],
          sizeTextMap[size],
          isDisabled ? disabledClass : `${variantMap[variant]} cursor-pointer`,
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

SolidButton.displayName = 'SolidButton';
