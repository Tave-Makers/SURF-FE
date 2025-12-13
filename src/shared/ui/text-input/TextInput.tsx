'use client';

import {
  forwardRef,
  useRef,
  useImperativeHandle,
  ComponentProps,
  TextareaHTMLAttributes,
  useState,
  useEffect,
} from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

/**
 * 범용 텍스트 입력 컴포넌트
 *
 * Controlled / Uncontrolled 양쪽 모드 모두 지원.
 * `mode`에 따라 줄바꿈 허용 여부 및 높이 자동 확장 방식이 달라집니다.
 */

const MAX_TEXTAREA_HEIGHT = 100; // 최대 높이(px)

type TextInputProps = {
  mode: 'search' | 'chat';
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  iconName?: SurfIconName;
  onIconClick?: () => void;
  onEnter?: (val: string) => void;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value' | 'onChange' | 'className'>;

export const TextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  (
    {
      mode,
      value,
      onChange,
      placeholder,
      iconName,
      onIconClick,
      onEnter,
      defaultValue,
      onKeyDown,
      ['aria-label']: ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    // Uncontrolled 기본값 처리
    const normalizedDefault = Array.isArray(defaultValue)
      ? defaultValue.join('')
      : (defaultValue?.toString() ?? '');

    const [internalValue, setInternalValue] = useState(value ?? normalizedDefault);
    const currentValue = value ?? internalValue;

    /** 입력값 변경 핸들러 */
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (onChange) onChange(newValue);
      else setInternalValue(newValue);
    };

    /** 자동 높이 확장 */
    useEffect(() => {
      const textarea = internalRef.current;
      if (!textarea) return;
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }, [currentValue]);

    /** Enter / Shift+Enter 제어 */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'Enter') {
        const isSingleLine = mode === 'search' || (mode === 'chat' && !event.shiftKey);
        if (isSingleLine) {
          event.preventDefault();
          onEnter?.(event.currentTarget.value);

          // Uncontrolled 모드일 때 입력창 초기화
          if (value === undefined) {
            setInternalValue('');
          }
        }
      }
    };

    return (
      <div className="rounded-6 bg-background-quaternary flex min-h-[2.25rem] w-full flex-1 items-center justify-between py-7 pr-8 pl-11 transition-[height] duration-150 ease-in-out">
        <textarea
          ref={internalRef}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          aria-label={ariaLabel ?? '텍스트 입력'}
          {...rest}
          className="text-body-body7 text-foreground-normal placeholder-foreground-foreground-quaternary flex-1 resize-none overflow-y-auto bg-transparent outline-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        />
        {iconName && (
          <button
            type="button"
            aria-label="입력창 아이콘 버튼"
            onClick={onIconClick}
            className="flex cursor-pointer items-center justify-center self-end"
          >
            <SurfIcon name={iconName} size="l" className="text-foreground-quaternary" />
          </button>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
