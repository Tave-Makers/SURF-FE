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
        className={`inline-flex w-fit items-center gap-10 ${
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
        <div className="bg-background-secondary group-has-[:checked]:bg-background-primary group-has-[:disabled]:bg-background-secondary relative h-[1.1875rem] w-[1.875rem] rounded-full transition-colors duration-300 group-has-[:focus-visible]:outline-[1.5px] group-has-[:focus-visible]:outline-offset-2">
          {/* 토글 핸들 */}
          <span className="bg-foreground-accent group-has-[:disabled]:bg-background-secondary-darker absolute top-[0.125rem] left-[0.125rem] h-[0.9375rem] w-[0.9375rem] rounded-full transition-transform duration-300 will-change-transform group-has-[:checked]:translate-x-[0.6875rem]" />
        </div>
        {label && <span className="text-body-body10 text-foreground-normal">{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
