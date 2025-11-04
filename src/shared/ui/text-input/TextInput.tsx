'use client';

import {
  forwardRef,
  useRef,
  useImperativeHandle,
  ComponentProps,
  InputHTMLAttributes,
  useState,
} from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

/**
 * 범용 텍스트 입력 컴포넌트
 *
 * Controlled / Uncontrolled 양쪽 모드 모두 지원합니다.
 *
 * ---
 * ### 🧩 사용 예시
 *
 * **Controlled**
 * ```tsx
 * const [text, setText] = useState('');
 * <TextInput value={text} onChange={setText} placeholder="입력하세요" />
 * ```
 *
 * **Uncontrolled**
 * ```tsx
 * <TextInput defaultValue="초기 메시지" placeholder="입력하세요" />
 * ```
 *
 * ---
 * ### ⚙️ Props
 * @typedef {object} TextInputProps
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
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  iconName?: SurfIconName;
  onIconClick?: () => void;
  onEnter?: (val: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ value, onChange, placeholder, iconName, onIconClick, onEnter, ...rest }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    const { onKeyDown, defaultValue, ['aria-label']: ariaLabel, ...inputProps } = rest;

    // uncontrolled 모드일 때 defaultValue를 문자열로 변환
    // (HTMLInputElement의 defaultValue는 string | number | string[] 가능)
    const normalizedDefault =
      defaultValue === undefined
        ? ''
        : Array.isArray(defaultValue)
          ? defaultValue.join('')
          : String(defaultValue);

    const [internalValue, setInternalValue] = useState(value ?? normalizedDefault);

    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value); // controlled 모드
      } else {
        setInternalValue(e.target.value); // uncontrolled 모드
      }
    };

    const currentValue = value !== undefined ? value : internalValue;

    return (
      <div className="bg-background-background-quaternary flex h-[2.25rem] w-full flex-1 items-center justify-between rounded-[62.43rem] py-[0.37rem] pr-[0.5rem] pl-[0.75rem]">
        <input
          value={currentValue}
          onChange={handleChange}
          onKeyDown={(event) => {
            onKeyDown?.(event);
            if (event.defaultPrevented) return;
            if (event.key === 'Enter') {
              onEnter?.(event.currentTarget.value);
            }
          }}
          ref={internalRef}
          className="text-body-body7 text-foreground-foreground-normal placeholder-foreground-foreground-quaternary flex-1 outline-none"
          placeholder={placeholder}
          {...inputProps}
          aria-label={ariaLabel ?? '텍스트 입력'}
        />

        {iconName && (
          <button
            type="button"
            aria-label="아이콘 버튼"
            onClick={onIconClick}
            className="flex cursor-pointer items-center justify-center"
          >
            <SurfIcon name={iconName} size="l" className="text-foreground-foreground-quaternary" />
          </button>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
