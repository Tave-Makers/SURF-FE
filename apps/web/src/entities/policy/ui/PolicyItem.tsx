'use client';

import { SurfIcon } from '@surf/ui/icon';
import type { ComponentProps, ButtonHTMLAttributes, ReactNode, MouseEvent } from 'react';
import { forwardRef } from 'react';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

export type PolicyItemProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
  rightIconName?: SurfIconName | null;
  isDisabled?: boolean;
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const PolicyItem = forwardRef<HTMLButtonElement, PolicyItemProps>(
  (
    { rightIconName, isDisabled = false, children, type = 'button', onClick, className, ...rest },
    ref,
  ) => {
    const baseClass =
      'flex flex-1 w-full self-stretch items-center justify-between py-12 px-13 bg-background-normal';

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        onClick={onClick}
        {...rest}
        className={[baseClass, className].filter(Boolean).join(' ')}
      >
        <div className="flex w-full items-center">
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

PolicyItem.displayName = 'PolicyItem';
