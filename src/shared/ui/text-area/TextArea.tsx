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
  value?: string;
  onChange?: (value: string) => void;
  guideMessage?: string;
  errorMessage?: string;
  textLimit?: number;
  isDisabled?: boolean;
  placeholder?: string;
  isOneLine?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      guideMessage,
      errorMessage,
      placeholder = '내용을 입력하세요',
      isDisabled = false,
      isOneLine = false,
      textLimit,
      className = '',
      onFocus: onFocusProp,
      onBlur: onBlurProp,
      ...rest
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const textColor = 'placeholder:text-foreground-hint text-foreground-normal';
    const borderColor = isFocused
      ? 'border border-[color:var(--color-border-primary)]'
      : 'border border-transparent';
    const disabledOpacity = isDisabled ? 'opacity-[var(--opacity-50,0.5)]' : '';

    useEffect(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      el.style.overflowY = el.scrollHeight > el.clientHeight ? 'auto' : 'hidden';
    }, [value, isOneLine]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocusProp?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlurProp?.(e);
    };

    return (
      <div className={`flex flex-col gap-[0.25rem] ${disabledOpacity} ${className}`}>
        <div
          className={`bg-background-normal-darker box-border flex flex-col gap-[0.37rem] rounded-[0.25rem] p-[0.62rem] ${borderColor}`}
          style={{ height: '100%', overflow: 'hidden' }}
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
              const rawValue = e.target.value;
              const newValue = isOneLine ? rawValue.replace(/\n/g, ' ') : rawValue;

              if (!textLimit || newValue.length <= textLimit) {
                onChange?.(newValue);
              }
            }}
            className={`text-body-14-400--2-24 w-full resize-none bg-transparent outline-none ${textColor} ${
              isOneLine ? 'overflow-hidden text-ellipsis whitespace-nowrap' : ''
            }`}
            rows={isOneLine ? 1 : undefined}
            {...rest}
          />

          {textLimit !== undefined && (
            <div className="text-caption-10-400--1 text-background-hint flex justify-end">
              {value?.length} / {textLimit}
            </div>
          )}
        </div>

        {errorMessage ? (
          <div className="text-caption-10-400--1 text-foreground-warning px-[0.625rem]">
            {errorMessage}
          </div>
        ) : guideMessage ? (
          <div className="text-caption-10-400--1 text-foreground-normal px-[0.625rem]">
            {guideMessage}
          </div>
        ) : null}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
