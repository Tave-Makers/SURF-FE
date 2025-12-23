'use client';

import { forwardRef, type HTMLAttributes } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

export type SelectFieldProps = Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> & {
  size: 'm' | 'l';
  selectedValue?: string;
  onClick?: () => void;
  isDisabled?: boolean;
  placeholder?: string;
};

const containerStyle =
  'flex flex-row items-center justify-between w-full p-10 rounded-3 bg-background-quaternary';

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProps>(
  (
    {
      size,
      selectedValue = '',
      onClick,
      isDisabled = false,
      placeholder = '',
      className = '',
      ...rest
    },
    ref,
  ) => {
    const isSelected = !!selectedValue;
    const textColor = isSelected ? 'text-foreground-normal' : 'text-foreground-tertiary';
    const textStyle = size === 'm' ? 'text-body-body11' : 'text-body-body9';
    const disabledOpacity = isDisabled ? 'opacity-[var(--opacity-50,0.5)]' : '';
    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        aria-disabled={isDisabled || undefined}
        aria-expanded={isSelected}
        className={[containerStyle, disabledOpacity, className].join(' ')}
        onClick={onClick}
        {...rest}
      >
        <div className={[textStyle, textColor].join(' ')}>
          {isSelected ? selectedValue : placeholder}
        </div>
        <div className="flex items-center">
          <SurfIcon name="ChevronRight" size={size} className="text-foreground-tertiary" />
        </div>
      </button>
    );
  },
);

SelectField.displayName = 'SelectField';
