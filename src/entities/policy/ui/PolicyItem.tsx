'use client';

import type { ComponentProps, ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';
import { forwardRef } from 'react';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

export type PolicyItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  rightIconName?: SurfIconName | null;
  isDisabled?: boolean;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const PolicyItem = forwardRef<HTMLButtonElement, PolicyItemProps>(
  ({ rightIconName, isDisabled = false, children, type = 'button', onClick, ...rest }, ref) => {
    const baseClass =
      'flex flex-1 w-full self-stretch items-center justify-between py-[0.87rem] bg-background-normal';

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
          {children && (
            <span className="font-body-14-400--2-22 text-foreground-normal">{children}</span>
          )}
        </div>
        {rightIconName && (
          <SurfIcon
            name={rightIconName}
            size={'s'}
            aria-hidden
            className="text-border-normal aspect-square opacity-100"
          />
        )}
      </button>
    );
  },
);

PolicyItem.displayName = 'PolicyItem';
