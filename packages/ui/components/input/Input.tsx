'use client';

import React, { forwardRef, useId, useMemo, useState, type InputHTMLAttributes } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

/**
 * 공용 Input props
 *
 * 사용 예시:
 * ```tsx
 * <Input
 *   type="password"
 *   value={value}
 *   onChange={setValue}
 *   guideMessage="영문/숫자 조합 8자 이상"
 *   prefix={<span>@</span>}
 *   suffix={<span>원</span>}
 * />
 * ```
 */
export type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  /**
   * 입력값 (controlled)
   */
  value: string;
  /**
   * 값 변경 콜백 (controlled)
   */
  onChange: (value: string) => void;
  /**
   * 하단 가이드 메시지
   */
  guideMessage?: string;
  /**
   * 하단 에러 메시지 (guideMessage보다 우선)
   */
  errorMessage?: string;
  /**
   * 비활성화 상태
   */
  isDisabled?: boolean;
  /**
   * 읽기 전용 상태
   */
  readOnly?: boolean;
  /**
   * 우측에 표시할 아이콘 슬롯
   */
  icon?: React.ReactNode;
  /**
   * 좌측 슬롯 (prefix)
   */
  prefix?: React.ReactNode;
  /**
   * 우측 슬롯 (suffix)
   */
  suffix?: React.ReactNode;
};

/**
 * 공용 Input 컴포넌트
 *
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      value,
      onChange,
      guideMessage,
      errorMessage,
      type = 'text',
      placeholder = '내용을 입력하세요',
      isDisabled = false,
      readOnly = false,
      icon,
      prefix,
      suffix,
      className = '',
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      ...rest
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const uid = useId();

    const isInteractive = !isDisabled && !readOnly;
    const hasValue = value.trim().length > 0;
    const isPasswordType = type === 'password';
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputType = isPasswordType ? (isPasswordVisible ? 'text' : 'password') : type;

    const textColor = hasValue ? 'text-foreground-normal' : 'text-foreground-tertiary';

    const borderColor =
      isInteractive && isFocused ? 'border border-border-primary' : 'border border-transparent';

    const containerOpacity = isDisabled ? 'opacity-50' : '';

    const { describedBy, guideId, errorId } = useMemo(() => {
      const gId = `input-guide-${uid}`;
      const eId = `input-error-${uid}`;
      const dBy = errorMessage ? eId : guideMessage ? gId : undefined;
      return { describedBy: dBy, guideId: gId, errorId: eId };
    }, [uid, errorMessage, guideMessage]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isInteractive) return;
      setIsFocused(true);
      onFocusProp?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (!isInteractive) return;
      setIsFocused(false);
      onBlurProp?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div
        className={`flex flex-col gap-5 ${containerOpacity} ${className}`}
        data-readonly={readOnly || undefined}
        data-disabled={isDisabled || undefined}
      >
        <div
          className={[
            'bg-background-quaternary',
            'rounded-3 box-border flex items-center gap-7 p-10',
            borderColor,
          ].join(' ')}
        >
          {prefix ? <div className="flex items-center">{prefix}</div> : null}

          <input
            ref={ref}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={readOnly}
            type={inputType}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={(e) => {
              if (!isInteractive) e.preventDefault();
            }}
            onChange={handleChange}
            className={[
              'text-body-body9',
              'w-full min-w-0 bg-transparent outline-none',
              'box-content appearance-none border-0 p-0',
              'placeholder:text-foreground-tertiary',
              textColor,
              readOnly ? 'cursor-default select-text' : '',
            ].join(' ')}
            aria-invalid={!!errorMessage}
            aria-readonly={readOnly || undefined}
            aria-describedby={describedBy}
            tabIndex={readOnly ? -1 : undefined}
            {...rest}
          />

          {suffix ? <div className="flex items-center">{suffix}</div> : null}

          {isPasswordType ? (
            <button
              type="button"
              aria-label={isPasswordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
              aria-pressed={isPasswordVisible}
              disabled={isDisabled}
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="text-foreground-tertiary flex items-center"
            >
              <SurfIcon name={isPasswordVisible ? 'SmileCircleSolid' : 'SmileCircle'} size="m" />
            </button>
          ) : null}

          {icon ? <div className="text-foreground-tertiary flex items-center">{icon}</div> : null}
        </div>

        {errorMessage ? (
          <div
            id={errorId}
            className="text-caption-caption6 text-foreground-danger px-10"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
          </div>
        ) : guideMessage ? (
          <div id={guideId} className="text-caption-caption6 text-foreground-normal px-10">
            {guideMessage}
          </div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
