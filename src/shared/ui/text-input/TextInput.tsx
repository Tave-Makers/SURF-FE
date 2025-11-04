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
 * Controlled / Uncontrolled 양쪽 모드 모두 지원하며,
 * `mode`에 따라 입력 동작(줄바꿈 허용 여부 및 높이 자동 확장)이 달라집니다.
 *
 * ---
 * ### 🧩 사용 예시
 *
 * **Controlled**
 * ```tsx
 * const [text, setText] = useState('');
 * <TextInput mode="chat" value={text} onChange={setText} placeholder="메시지를 입력하세요" />
 * ```
 *
 * **Uncontrolled**
 * ```tsx
 * <TextInput mode="search" defaultValue="기본 메시지" placeholder="검색어를 입력하세요" />
 * ```
 *
 * ---
 * ### ⚙️ Props
 * @typedef {object} TextInputProps
 * @property {'search' | 'chat'} mode - 입력 모드 (줄바꿈 및 높이 자동 확장 여부 제어)
 * @property {string} [value] - 입력값 (Controlled 모드)
 * @property {(val: string) => void} [onChange] - 입력값 변경 핸들러 (Controlled 모드)
 * @property {string} [placeholder] - placeholder 텍스트
 * @property {string} [iconName] - 우측 아이콘 이름
 * @property {() => void} [onIconClick] - 아이콘 클릭 시 호출되는 콜백
 * @property {(val: string) => void} [onEnter] - Enter 입력 시 호출되는 콜백
 * @property {string | number | string[]} [defaultValue] - uncontrolled 모드 초기값
 * @property {string} [aria-label] - 접근성용 레이블 (기본값: `"텍스트 입력"`)
 */
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
  ({ mode, value, onChange, placeholder, iconName, onIconClick, onEnter, ...rest }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const { onKeyDown, defaultValue, ['aria-label']: ariaLabel, ...inputProps } = rest;

    // uncontrolled 모드일 때 defaultValue를 문자열로 변환
    const normalizedDefault =
      defaultValue === undefined
        ? ''
        : Array.isArray(defaultValue)
          ? defaultValue.join('')
          : String(defaultValue);

    const [internalValue, setInternalValue] = useState(value ?? normalizedDefault);

    useImperativeHandle(ref, () => internalRef.current as HTMLTextAreaElement);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) onChange(e.target.value);
      else setInternalValue(e.target.value);
    };

    const currentValue = value !== undefined ? value : internalValue;

    /** 높이 자동 확장 */
    useEffect(() => {
      if (!internalRef.current || !wrapperRef.current) return;

      const textarea = internalRef.current;
      const wrapper = wrapperRef.current;

      // textarea 높이 초기화 후 scrollHeight 계산
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 120); // 최대 높이 제한
      textarea.style.height = `${newHeight}px`;
      wrapper.style.height = `${newHeight + 12}px`;
    }, [currentValue]);

    /** Enter / Shift+Enter 제어 */
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;

      // chat + Shift+Enter → 줄바꿈 허용
      if (event.key === 'Enter') {
        if (mode === 'search' || (mode === 'chat' && !event.shiftKey)) {
          event.preventDefault();
          onEnter?.(event.currentTarget.value);
        }
      }
    };

    return (
      <div
        ref={wrapperRef}
        className="bg-background-background-quaternary rounded-6 flex min-h-[2.25rem] w-full flex-1 items-center justify-between py-7 pr-8 pl-11 transition-[height] duration-150 ease-in-out"
      >
        <textarea
          ref={internalRef}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="text-body-body7 text-foreground-foreground-normal placeholder-foreground-foreground-quaternary flex-1 resize-none overflow-hidden bg-transparent leading-[1.25rem] outline-none"
          placeholder={placeholder}
          {...inputProps}
          aria-label={ariaLabel ?? '텍스트 입력'}
        />
        {iconName && (
          <button
            type="button"
            aria-label="아이콘 버튼"
            onClick={onIconClick}
            className="flex cursor-pointer items-center justify-center self-end"
          >
            <SurfIcon name={iconName} size="l" className="text-foreground-foreground-quaternary" />
          </button>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
