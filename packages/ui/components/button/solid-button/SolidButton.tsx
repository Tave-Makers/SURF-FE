'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '../../icon/SurfIcon';

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

const sizePaddingMap: Record<ButtonSize, string> = {
  s: 'p-7',
  m: 'p-9',
  l: 'p-11',
};

const sizeTextMap: Record<ButtonSize, string> = {
  s: 'text-body-body8',
  m: 'text-body-body6',
  l: 'text-body-body6',
};

const variantMap: Record<ButtonVariant, string> = {
  primary: 'text-foreground-static-white bg-background-primary hover:bg-background-primary-darker',
  secondary: 'text-foreground-normal bg-background-secondary hover:bg-background-secondary-darker',
  danger: 'text-foreground-static-white bg-foreground-danger hover:bg-foreground-danger-darker',
  warning:
    'text-foreground-danger bg-background-secondary hover:bg-background-secondary-darker hover:text-background-danger-darker',
};

const baseStyle = 'inline-flex w-full items-center justify-center overflow-hidden rounded-3';
const disabledStyle =
  'bg-background-secondary-darker text-foreground-static-white cursor-not-allowed opacity-50';

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
    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
        className={[
          baseStyle,
          sizePaddingMap[size],
          sizeTextMap[size],
          isDisabled ? disabledStyle : `${variantMap[variant]}`,
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
