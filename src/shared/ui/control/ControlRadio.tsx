'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes, ChangeEvent } from 'react';

export type ControlRadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  id: string; // input과 label 연결용 고유 ID
  name: string; // 라디오 그룹 이름
  value: string; // 선택 시 전달되는 값
  label?: string; // 라디오 버튼 옆 텍스트
  checked?: boolean; // Controlled 방식
  defaultChecked?: boolean; // Uncontrolled 초기값
  disabled?: boolean; // 비활성화 여부
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const ControlRadio = forwardRef<HTMLInputElement, ControlRadioProps>(
  (
    { id, name, value, label, checked, defaultChecked, disabled = false, onChange, ...rest },
    ref,
  ) => {
    return (
      <label
        htmlFor={id}
        className={`inline-flex cursor-pointer items-center gap-[0.625rem] ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={onChange}
          ref={ref}
          className="checked:border-background-primary border-border-normal checked:bg-background-primary h-[1.25rem] w-[1.25rem] cursor-pointer appearance-none rounded-full border p-[3.2px] checked:bg-clip-content disabled:cursor-not-allowed"
          {...rest}
        />
        {label && <span className="text-border-contrast text-caption-12-400">{label}</span>}
      </label>
    );
  },
);

ControlRadio.displayName = 'ControlRadio';
