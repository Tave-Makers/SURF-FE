'use client';

import {
  forwardRef,
  useRef,
  useEffect,
  useState,
  type RefObject,
  type TextareaHTMLAttributes,
} from 'react';

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
  textLimit?: number;
  isDisabled?: boolean;
  placeholder?: string;
  isOneLine?: boolean;
  height: number;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      errorMessage,
      placeholder = '내용을 입력하세요',
      isDisabled = false,
      isOneLine = false,
      textLimit,
      height = 3.81,
      className = '',
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const textColor = isFocused ? 'text-foreground-normal' : 'text-foreground-hint';

    const borderColor = isFocused
      ? 'border border-[color:var(--color-border-primary)]'
      : 'border border-transparent';

    const disabledOpacity = isDisabled ? 'opacity-[var(--opacity-50,0.5)]' : '';

    useEffect(() => {
      const el = textareaRef.current;
      if (el) {
        el.style.height = 'auto';
        el.style.height = `${height * 16}px`;

        if (el.scrollHeight > el.clientHeight) {
          el.style.overflowY = 'auto';
        } else {
          el.style.overflowY = 'hidden';
        }
      }
    }, [value, height]);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
      <div className={`flex flex-col gap-[0.25rem] ${disabledOpacity} ${className}`}>
        <div
          className={`bg-background-normal-darker box-border flex flex-col gap-[0.37rem] rounded-[0.25rem] p-[0.62rem] ${borderColor}`}
          style={{ height: `${height}rem`, overflow: 'hidden' }}
        >
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') {
                ref(node);
              } else if (ref && 'current' in ref) {
                (ref as RefObject<HTMLTextAreaElement>).current = node as HTMLTextAreaElement;
              }
            }}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={(e) => {
              let newValue = e.target.value;

              if (isOneLine) {
                newValue = newValue.replace(/\n/g, ' ');
              }

              if (!textLimit || newValue.length <= textLimit) {
                onChange(newValue);
              }
            }}
            className={`text-body-14-400--2-24 w-full resize-none bg-transparent outline-none ${textColor} ${
              isOneLine ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''
            }`}
            rows={isOneLine ? 1 : undefined}
            {...props}
          />

          {textLimit !== undefined && (
            <div className="text-caption-10-400--1 text-background-hint flex justify-end">
              {value.length} / {textLimit}
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="text-caption-10-400--1 text-foreground-warning px-[0.625rem]">
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
