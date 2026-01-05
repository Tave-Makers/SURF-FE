'use client';

import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useState,
  useEffect,
  type ComponentProps,
  type TextareaHTMLAttributes,
} from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

const MAX_TEXTAREA_HEIGHT = 100;

const containerStyle =
  'flex w-full flex-1 min-w-0 min-h-[2.25rem] items-center justify-between ' +
  'rounded-6 bg-background-quaternary py-7 pl-11 pr-8 ' +
  'transition-[height] duration-150 ease-in-out';

const textareaStyle =
  'flex-1 resize-none overflow-y-auto bg-transparent outline-none ' +
  'text-body-body6 text-foreground-normal ' +
  'placeholder-foreground-quaternary ' +
  '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const iconButtonStyle = 'flex cursor-pointer items-center justify-center self-end';

const iconStyle = 'text-foreground-quaternary';

/**
 * 범용 텍스트 입력 컴포넌트
 * - Controlled / Uncontrolled 모드 모두 지원
 * - mode에 따라 Enter / Shift+Enter 동작이 달라짐
 * - 입력 높이는 내용에 따라 자동 확장됨 (최대 높이 제한)
 *
 * @param props - TextInput 컴포넌트 props
 * @param props.mode - 입력 모드
 *   - `search`: Enter 시 즉시 submit
 *   - `chat`: Enter = submit, Shift+Enter = 줄바꿈
 * @param props.value - (controlled) 현재 입력값
 * @param props.onChange - 입력값 변경 시 호출되는 콜백
 * @param props.placeholder - 입력창 placeholder 텍스트
 * @param props.iconName - 우측에 표시할 아이콘 이름
 * @param props.onIconClick - 아이콘 클릭 시 호출되는 콜백
 * @param props.onEnter - Enter 입력 시 호출되는 콜백
 */
export type TextInputProps = {
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

    // Uncontrolled 기본값 정규화
    const normalizedDefault = Array.isArray(defaultValue)
      ? defaultValue.join('')
      : (defaultValue?.toString() ?? '');

    const [internalValue, setInternalValue] = useState(value ?? normalizedDefault);

    const currentValue = value ?? internalValue;

    /** 입력값 변경 */
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value;

      if (onChange) {
        onChange(next);
      } else {
        setInternalValue(next);
      }
    };

    /** 자동 높이 조절 */
    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
    }, [currentValue]);

    /** Enter / Shift+Enter 처리 */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      if (event.key === 'Enter') {
        const isSubmit = mode === 'search' || (mode === 'chat' && !event.shiftKey);

        if (isSubmit) {
          event.preventDefault();
          onEnter?.(event.currentTarget.value);

          // uncontrolled일 경우 초기화
          if (value === undefined) {
            setInternalValue('');
          }
        }
      }
    };

    return (
      <div className={containerStyle}>
        <textarea
          ref={internalRef}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder={placeholder}
          aria-label={ariaLabel ?? '텍스트 입력'}
          className={textareaStyle}
          {...rest}
        />

        {iconName && (
          <button
            type="button"
            aria-label="입력창 아이콘 버튼"
            onClick={onIconClick}
            className={iconButtonStyle}
          >
            <SurfIcon name={iconName} size="l" className={iconStyle} />
          </button>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
