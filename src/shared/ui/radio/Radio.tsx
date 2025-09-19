'use client';

import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ChangeEvent } from 'react';

type BaseProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'children' | 'className' | 'checked' | 'defaultChecked' | 'disabled' | 'onChange'
> & {
  id: string; // 고유 ID (label과 연결)
  name: string; // 라디오 그룹 이름
  value: string; // 선택 시 전달되는 값
  label?: string; // 라디오 버튼 옆 텍스트
  isDisabled?: boolean; // 비활성화 여부
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

// 최종 RadioProps
export type RadioProps = BaseProps & (ControlledProps | UncontrolledProps);

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    { id, name, value, label, isChecked, isDefaultChecked, isDisabled = false, onChange, ...rest },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={`inline-flex w-fit cursor-pointer items-center gap-[0.62rem] px-[0.25rem] py-[0.37em] ${
          isDisabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        <input
          id={inputId}
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

export default Radio;
