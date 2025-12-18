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
    const baseClass =
      'flex flex-1 w-full self-stretch items-center justify-between px-13 py-12 gap-1 bg-background-normal';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
        className={baseClass}
      >
        <div className="flex w-full items-center gap-13">
          {leftIconName && (
            <SurfIcon
              name={leftIconName}
              size={'m'}
              aria-hidden
              className="text-foreground-normal"
            />
          )}
          {children && <span className="text-body-body8 text-foreground-normal">{children}</span>}
        </div>
        {rightIconName && (
          <SurfIcon
            name={rightIconName}
            size={'s'}
            aria-hidden
            className="text-foreground-tertiary aspect-square opacity-100"
          />
        )}
      </button>
    );
  },
);

SettingsItem.displayName = 'SettingsItem';
