'use client';

import {
  forwardRef,
  useRef,
  useImperativeHandle,
  ComponentProps,
  InputHTMLAttributes,
} from 'react';
import { SurfIcon } from '../icon/SurfIcon';

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

type TextInputProps = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  iconName?: SurfIconName; // 아이콘 이름
  onIconClick?: () => void; // 아이콘 클릭 이벤트
  onEnter?: (val: string) => void; // Enter 입력 이벤트
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'className' | 'onKeyDown'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ value, onChange, placeholder, iconName, onIconClick, onEnter, ...rest }, ref) => {
    const internalRef = useRef<HTMLInputElement>(null);

    /* 외부에서 ref를 넘겨주면 내부 input DOM을 직접 제어할 수 있게 노출 */
    useImperativeHandle(ref, () => internalRef.current as HTMLInputElement);

    return (
      <div className="bg-background-tertiary flex h-[2.25rem] w-full flex-1 items-center justify-between rounded-[62.43rem] py-[0.37rem] pr-[0.5rem] pl-[0.75rem]">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={internalRef}
          className="text-body-14-400--2-22 text-foreground-normal placeholder-background-quaternary flex-1 outline-none"
          placeholder={placeholder}
          {...rest}
          aria-label={rest['aria-label'] ?? '텍스트 입력'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const trimmed = value.trim();
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
            <SurfIcon name={iconName} size="l" className="text-border-normal" />
          </button>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
