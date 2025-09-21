'use client';

import { forwardRef, InputHTMLAttributes, ChangeEvent, useId } from 'react';

type BaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'checked' | 'defaultChecked' | 'disabled' | 'onChange' | 'className'
> & {
  id?: string;
  label?: string;
  isDisabled?: boolean;
  className?: string;
};

type ControlledProps = {
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDefaultChecked?: never;
};

type UncontrolledProps = {
  isDefaultChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isChecked?: never;
};

export type ToggleProps = BaseProps & (ControlledProps | UncontrolledProps);

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ id, label, isChecked, isDefaultChecked, isDisabled, name, value, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex w-fit items-center gap-[0.62rem] ${
          isDisabled ? '!cursor-not-allowed' : 'cursor-pointer'
        } group`}
      >
        <input
          id={inputId}
          type="checkbox"
          ref={ref}
          name={name}
          value={value}
          checked={isChecked}
          defaultChecked={isDefaultChecked}
          disabled={isDisabled}
          aria-label={label ? undefined : '토글 버튼'}
          className="sr-only"
          {...rest}
        />
        {/* 토글 트랙 */}
        <div className="bg-background-hint group-has-[:checked]:bg-background-primary relative h-[1.125rem] w-[1.875rem] rounded-full transition-colors duration-300 group-has-[:focus-visible]:outline-[1.5px] group-has-[:focus-visible]:outline-offset-2">
          {/* 토글 핸들 */}
          <span
            className={`absolute top-[0.09rem] left-[0.09rem] h-[0.9375rem] w-[0.9375rem] rounded-full transition-transform duration-300 will-change-transform ${
              isDisabled ? 'bg-foreground-hint-darker' : 'bg-foreground-accent'
            } group-has-[:checked]:translate-x-[0.76rem]`}
          />
        </div>
        {label && <span className="text-caption-12-400 text-border-contrast">{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
