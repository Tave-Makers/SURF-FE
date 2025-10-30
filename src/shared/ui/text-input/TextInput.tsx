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

type TextInputProps = {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  iconName?: SurfIconName; // 아이콘 이름
  onIconClick?: () => void; // 아이콘 클릭 이벤트
  onEnter?: (val: string) => void; // Enter 입력 이벤트
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className' | 'onKeyDown'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ value, onChange, placeholder, iconName, onIconClick, onEnter, ...rest }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = useState(value ?? '');

    /* 외부에서 ref를 넘겨주면 내부 input DOM을 직접 제어할 수 있게 노출 */
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
          ref={internalRef}
          className="text-body-body7 text-foreground-foreground-normal placeholder-foreground-foreground-quaternary flex-1 outline-none"
          placeholder={placeholder}
          {...rest}
          aria-label={rest['aria-label'] ?? '텍스트 입력'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const trimmed = currentValue.trim();
              if (!trimmed) return;
              // 현재 input의 value를 앞뒤 공백 제거해 onEnter 콜백에 전달
              onEnter?.(trimmed);
            }
          }}
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
