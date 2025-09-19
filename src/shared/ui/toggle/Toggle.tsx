'use client';

import { forwardRef, InputHTMLAttributes, ChangeEvent, useId } from 'react';

// 공통 속성
type BaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'checked' | 'defaultChecked' | 'disabled' | 'onChange' | 'className'
> & {
  id?: string; // 고유 ID
  label?: string; // 옆에 표시할 텍스트
  isDisabled?: boolean;
  className?: string; // wrapper 확장용 (필요 없으면 제거)
};

// Controlled 전용
type ControlledProps = {
  isChecked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDefaultChecked?: never;
};

// Uncontrolled 전용
type UncontrolledProps = {
  isDefaultChecked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  isChecked?: never;
};

// 최종 Props
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
        }`}
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
          className="peer sr-only"
          {...rest}
        />
        <div className="peer-checked:bg-background-primary bg-background-hint flex h-[1.12rem] w-[1.87rem] items-center rounded-full p-[0.09rem] transition-colors duration-300 peer-checked:justify-end">
          <span
            className={`h-[0.93rem] w-[0.93rem] rounded-full transition-transform duration-300 ${
              isDisabled ? 'bg-foreground-hint-darker' : 'bg-foreground-accent'
            }`}
          />
        </div>
        {label && <span className="text-caption-12-400 text-border-contrast">{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
