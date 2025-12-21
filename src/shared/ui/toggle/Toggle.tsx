'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ChangeEvent } from 'react';

const labelBaseStyle = 'inline-flex w-fit items-center gap-10 group';

const labelEnabledStyle = 'cursor-pointer';

const labelDisabledStyle = '!cursor-not-allowed';

const inputHiddenStyle = 'sr-only';

const trackStyle =
  'relative h-[1.1875rem] w-[1.875rem] rounded-full ' +
  'bg-background-secondary transition-colors duration-300 ' +
  'group-has-[:checked]:bg-background-primary ' +
  'group-has-[:disabled]:bg-background-secondary ' +
  'group-has-[:focus-visible]:outline-[1.5px] ' +
  'group-has-[:focus-visible]:outline-offset-2';

const handleStyle =
  'absolute top-[0.125rem] left-[0.125rem] ' +
  'h-[0.9375rem] w-[0.9375rem] rounded-full ' +
  'bg-foreground-static-white ' +
  'transition-transform duration-300 will-change-transform ' +
  'group-has-[:checked]:translate-x-[0.6875rem] ' +
  'group-has-[:disabled]:bg-background-secondary-darker';

const labelTextStyle = 'text-body-body10 text-foreground-normal';

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

/**
 *
 * @param props - Toggle 컴포넌트 props
 * @param props.id - input id (미지정 시 자동 생성)
 * @param props.label - 토글 우측에 표시되는 라벨 텍스트
 * @param props.isChecked - (controlled) 현재 토글 상태
 * @param props.isDefaultChecked - (uncontrolled) 초기 토글 상태
 * @param props.onChange - 토글 상태 변경 시 호출되는 콜백
 * @param props.isDisabled - 토글 비활성화 여부
 */
export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  (
    { id, label, isChecked, isDefaultChecked, isDisabled, name, value, className, ...rest },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <label
        htmlFor={inputId}
        className={[
          labelBaseStyle,
          isDisabled ? labelDisabledStyle : labelEnabledStyle,
          className,
        ].join(' ')}
      >
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          defaultChecked={isDefaultChecked}
          disabled={isDisabled}
          aria-label={label ? undefined : '토글 버튼'}
          className={inputHiddenStyle}
          {...rest}
        />

        <div className={trackStyle}>
          <span className={handleStyle} />
        </div>

        {label && <span className={labelTextStyle}>{label}</span>}
      </label>
    );
  },
);

Toggle.displayName = 'Toggle';
