'use client';

import { forwardRef, useRef, useLayoutEffect, useState, type TextareaHTMLAttributes } from 'react';

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange' | 'value'
> & {
  value: string;
  mode?: 'oneLine' | 'multiLine';
  onChange: (value: string) => void;
  guideMessage?: string;
  errorMessage?: string;
  textLimit?: number;
  isDisabled?: boolean;
  placeholder?: string;
  readOnly?: boolean;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      value,
      onChange,
      mode = 'oneLine',
      guideMessage,
      errorMessage,
      placeholder = '내용을 입력하세요',
      isDisabled = false,
      readOnly = false,
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

    const hasValue = value.trim().length > 0;
    const isInteractive = !(isDisabled || readOnly);

    const textColor = hasValue ? 'text-foreground-normal' : 'text-foreground-hint';
    const borderColor =
      isInteractive && isFocused ? 'border border-border-primary' : 'border border-transparent';

    const disabledOpacity = isDisabled ? 'opacity-[var(--opacity-50,0.5)]' : '';

    useLayoutEffect(() => {
      if (!textareaRef.current || mode === 'oneLine') return;
      const el = textareaRef.current;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      el.style.overflowY = el.scrollHeight > el.clientHeight ? 'auto' : 'hidden';
    }, [value, mode]);

    useLayoutEffect(() => {
      if (mode !== 'oneLine' || !textareaRef.current) return;
      const el = textareaRef.current;
      el.style.height = '24px';
      el.style.overflow = 'hidden';
    }, [mode]);

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!isInteractive) return;
      setIsFocused(true);
      onFocusProp?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (!isInteractive) return;
      setIsFocused(false);
      onBlurProp?.(e);
    };

    return (
      <div
        className={`flex flex-col gap-[0.25rem] ${disabledOpacity} ${className}`}
        data-readonly={readOnly || undefined}
        data-disabled={isDisabled || undefined}
      >
        <div
          className={[
            'bg-background-normal-darker',
            'box-border flex flex-col gap-[0.37rem] rounded-[0.25rem] p-[0.625rem]',
            borderColor,
          ].join(' ')}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <textarea
            ref={(node) => {
              textareaRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref && 'current' in ref)
                (ref as React.RefObject<HTMLTextAreaElement>).current = node as HTMLTextAreaElement;
            }}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={readOnly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={(e) => {
              if (readOnly) e.preventDefault();
            }}
            onChange={(e) => {
              const raw = e.target.value;
              const next = mode === 'oneLine' ? raw.replace(/\n/g, ' ') : raw;
              if (!textLimit || next.length <= textLimit) onChange(next);
            }}
            maxLength={typeof textLimit === 'number' ? textLimit : undefined}
            className={[
              'text-body-14-400--2-24',
              'w-full resize-none bg-transparent outline-none',
              'box-content min-h-0 appearance-none border-0 p-0',
              'placeholder:text-foreground-hint',
              textColor,
              readOnly ? 'cursor-default select-text' : '',
              mode === 'oneLine'
                ? 'h-[1.5rem] overflow-hidden leading-[1.5rem] text-ellipsis whitespace-nowrap'
                : '',
            ].join(' ')}
            rows={mode === 'oneLine' ? 1 : undefined}
            aria-invalid={!!errorMessage}
            aria-readonly={readOnly || undefined}
            aria-describedby={
              errorMessage ? 'textarea-error' : guideMessage ? 'textarea-guide' : undefined
            }
            tabIndex={readOnly ? -1 : undefined}
            {...rest}
          />

          {typeof textLimit === 'number' && (
            <div className="text-caption-10-400--1 text-background-hint flex justify-end">
              {value.length} / {textLimit}
            </div>
          )}
        </div>

        {errorMessage ? (
          <div
            id="textarea-error"
            className="text-caption-10-400--1 text-foreground-warning px-[0.625rem]"
          >
            {errorMessage}
          </div>
        ) : guideMessage ? (
          <div
            id="textarea-guide"
            className="text-caption-10-400--1 text-foreground-normal px-[0.625rem]"
          >
            {guideMessage}
          </div>
        ) : null}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
