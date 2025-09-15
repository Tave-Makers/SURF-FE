'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes, ChangeEvent } from 'react';
import { Check } from '@mynaui/icons-react';

export type ControlCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children'
> & {
  id: string; // input과 label 연결용 고유 ID
  label?: string; // 체크박스 옆 텍스트
  checked?: boolean; // Controlled 방식
  defaultChecked?: boolean; // Uncontrolled 초기값
  disabled?: boolean; // 비활성화 여부
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const ControlCheckbox = forwardRef<HTMLInputElement, ControlCheckboxProps>(
  ({ id, label, checked, defaultChecked, disabled = false, onChange, ...rest }, ref) => {
    return (
      <label
        htmlFor={id}
        className={`inline-flex cursor-pointer items-center gap-[0.625rem] ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <div className="relative h-[1.25rem] w-[1.25rem]">
          <input
            type="checkbox"
            id={id}
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            onChange={onChange}
            ref={ref}
            className="peer bg-background-normal checked:bg-background-primary border-border-normal h-full w-full cursor-pointer appearance-none rounded-[0.125rem] border checked:border-none disabled:cursor-not-allowed"
            {...rest}
          />
          <span className="text-foreground-accent pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100">
            <Check className="h-[1rem] w-[1rem] stroke-[1.2px]" />
          </span>
        </div>
        {label && <span className="text-caption-12-400 text-border-contrast">{label}</span>}
      </label>
    );
  },
);

ControlCheckbox.displayName = 'ControlCheckbox';
