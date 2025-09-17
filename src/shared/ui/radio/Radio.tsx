'use client';

import { forwardRef } from 'react';
import type { InputHTMLAttributes, ChangeEvent } from 'react';

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> & {
  id: string; // input과 label 연결용 고유 ID
  name: string; // 라디오 그룹 이름
  value: string; // 선택 시 전달되는 값
  label?: string; // 라디오 버튼 옆 텍스트
  isChecked?: boolean; // Controlled 방식
  isDefaultChecked?: boolean; // Uncontrolled 초기값
  isDisabled?: boolean; // 비활성화 여부
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { id, name, value, label, isChecked, isDefaultChecked, isDisabled = false, onChange, ...rest },
    ref,
  ) => {
    return (
      <label
        htmlFor={id}
        className={`inline-flex cursor-pointer items-center gap-[0.625rem] ${
          isDisabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={isChecked}
          defaultChecked={isDefaultChecked}
          disabled={isDisabled}
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

Radio.displayName = 'Radio';
