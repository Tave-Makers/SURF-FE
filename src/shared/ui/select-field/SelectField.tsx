'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

export type SelectFieldProps = Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  size: 'm' | 'l';
  label: string;
  onClick?: () => void;
  isDisabled?: boolean;
  isOpen?: boolean;
};

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  ({ size, label, onClick, isDisabled = false, isOpen = false, className = '', ...rest }, ref) => {
    const textColor = isOpen ? 'text-foreground-normal' : 'text-foreground-hint';

    const sizeTextClass = size === 'm' ? 'text-caption-12-400' : 'text-body-14-400--2-24';
    const containerBase =
      'flex flex-row items-center justify-between w-full p-[0.62rem] rounded-[0.25rem] bg-background-normal-darker';
    const disabledOpacity = isDisabled ? 'opacity-[var(--opacity-50,0.5)]' : '';

    const handleClick = () => {
      if (isDisabled) return;
      onClick?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-expanded={isOpen}
        className={[containerBase, disabledOpacity, className].join(' ')}
        {...rest}
        onClick={handleClick}
      >
        <div className={[sizeTextClass, textColor].join(' ')}>{label}</div>
        <div className="flex items-center">
          <SurfIcon
            name="ChevronRight"
            size={size}
            className="text-[color:var(--color-border-hint)]"
          />
        </div>
      </button>
    );
  },
);

SelectField.displayName = 'SelectField';
