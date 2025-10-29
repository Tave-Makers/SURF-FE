'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ChangeEvent } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

// 공통 속성
type BaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'checked' | 'defaultChecked' | 'disabled' | 'onChange' | 'className'
> & {
  id?: string; // 고유 ID
  label?: string; // 체크박스 옆 텍스트
  isDisabled?: boolean;
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
export type CheckboxProps = BaseProps & (ControlledProps | UncontrolledProps);

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, isChecked, isDefaultChecked, isDisabled = false, onChange, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex w-fit cursor-pointer items-center gap-[0.62rem] px-[0.25rem] py-[0.37em] ${
          isDisabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <div className="relative h-[1.25rem] w-[1.25rem]">
          <input
            type="checkbox"
            id={inputId}
            checked={isChecked}
            defaultChecked={isDefaultChecked}
            disabled={isDisabled}
            onChange={onChange}
            ref={ref}
            className="peer bg-background-normal checked:bg-background-primary border-border-normal h-full w-full cursor-pointer appearance-none rounded-[0.12rem] border checked:border-none disabled:cursor-not-allowed"
            {...rest}
          />
          <span className="text-foreground-accent pointer-events-none absolute top-1/2 left-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center opacity-0 peer-checked:opacity-100">
            <SurfIcon name="Check" size="s" />
          </span>
        </div>
        {label && <span className="text-caption-12-400 text-border-contrast">{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';
