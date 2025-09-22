'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

export type SettingsItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  leftIconName?: SurfIconName | null;
  rightIconName?: SurfIconName | null;
  isDisabled?: boolean;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const SettingsItem = forwardRef<HTMLButtonElement, SettingsItemProps>(
  (
    {
      leftIconName,
      rightIconName,
      isDisabled = false,
      children,
      type = 'button',
      onClick,
      ...rest
    },
    ref,
  ) => {
    const size = 'm';

    const baseClass =
      'flex flex-1 w-[23.43rem] self-stretch items-center justify-between px-[1rem] py-[0.87rem] bg-background-normal';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
        className={baseClass}
      >
        <div className="flex w-full items-center gap-[1rem]">
          {leftIconName && (
            <SurfIcon
              name={leftIconName}
              size={size}
              aria-hidden
              className="text-logo-normal h-[1.25rem] w-[1.25rem] opacity-100"
            />
          )}
          {children && (
            <span className="font-body-14-400--2-22 text-foreground-normal">{children}</span>
          )}
        </div>
        {rightIconName && (
          <SurfIcon
            name={rightIconName}
            size={size}
            aria-hidden
            className="text-border-normal aspect-square h-[1rem] w-[1rem] opacity-100"
          />
        )}
      </button>
    );
  },
);

SettingsItem.displayName = 'SettingsItem';
