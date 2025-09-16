'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

export type ToggleProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  id: string; // 고유 ID
  label?: string; // 옆에 표시할 텍스트
  isChecked?: boolean; // Controlled 모드
  isDefaultChecked?: boolean; // Uncontrolled 모드 초기값
  isDisabled?: boolean; // 비활성화 여부
  name?: string; // 폼 name
  value?: string; // 폼 value
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ id, label, isChecked, isDefaultChecked, isDisabled, name, value, ...rest }, ref) => {
    return (
      <label
        htmlFor={id}
        className={`inline-flex items-center gap-[0.625rem] ${
          isDisabled ? '!cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <input
          id={id}
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
        <div className="peer-checked:bg-background-primary bg-background-hint flex h-[1.125rem] w-[1.875rem] items-center rounded-full p-[0.09375rem] transition-colors duration-300 peer-checked:justify-end">
          <span
            className={`h-[0.9375rem] w-[0.9375rem] rounded-full transition-transform duration-300 ${
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
