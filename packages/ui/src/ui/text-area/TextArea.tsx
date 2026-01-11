'use client';

import React, {
  forwardRef,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type TextareaHTMLAttributes,
} from 'react';

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
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [isFocused, setIsFocused] = useState(false);
    const uid = useId();

    const isInteractive = !isDisabled && !readOnly;

    const hasValue = value.trim().length > 0;

    const textColor = hasValue ? 'text-foreground-normal' : 'text-foreground-tertiary';

    const borderColor =
      isInteractive && isFocused ? 'border border-border-primary' : 'border border-transparent';

    const containerOpacity = isDisabled ? 'opacity-50' : '';

    const { describedBy, guideId, errorId } = useMemo(() => {
      const gId = `textarea-guide-${uid}`;
      const eId = `textarea-error-${uid}`;
      const dBy = errorMessage ? eId : guideMessage ? gId : undefined;
      return { describedBy: dBy, guideId: gId, errorId: eId };
    }, [uid, errorMessage, guideMessage]);

    const setRefs = (node: HTMLTextAreaElement | null) => {
      textareaRef.current = node;

      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    useLayoutEffect(() => {
      const el = textareaRef.current;
      if (!el) return;

      if (mode === 'oneLine') {
        el.style.height = '24px';
        el.style.overflow = 'hidden';
        return;
      }

      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
      // 내용이 많아져도 기본은 늘어나고, 필요시 스크롤
      el.style.overflowY = el.scrollHeight > el.clientHeight ? 'auto' : 'hidden';
    }, [value, mode]);

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

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const raw = e.target.value;

      const next = mode === 'oneLine' ? raw.replace(/\n/g, ' ') : raw;

      if (typeof textLimit === 'number' && next.length > textLimit) return;
      onChange(next);
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
            'rounded-3 box-border flex flex-col gap-7 p-10',
            borderColor,
          ].join(' ')}
          style={{ height: '100%', overflow: 'hidden' }}
        >
          <textarea
            ref={setRefs}
            value={value}
            placeholder={placeholder}
            disabled={isDisabled}
            readOnly={readOnly}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onMouseDown={(e) => {
              if (!isInteractive) e.preventDefault();
            }}
            onChange={handleChange}
            maxLength={typeof textLimit === 'number' ? textLimit : undefined}
            className={[
              'text-body-body9',
              'w-full resize-none bg-transparent outline-none',
              'box-content min-h-0 appearance-none border-0 p-0',
              'placeholder:text-foreground-tertiary',
              textColor,
              readOnly ? 'cursor-default select-text' : '',
              mode === 'oneLine'
                ? 'h-[1.5rem] overflow-hidden leading-[1.5rem] text-ellipsis whitespace-nowrap'
                : '',
            ].join(' ')}
            rows={mode === 'oneLine' ? 1 : undefined}
            aria-invalid={!!errorMessage}
            aria-readonly={readOnly || undefined}
            aria-describedby={describedBy}
            tabIndex={readOnly ? -1 : undefined}
            {...rest}
          />

          {typeof textLimit === 'number' && (
            <div className="text-caption-caption6 text-foreground-tertiary flex justify-end">
              {value.length} / {textLimit}
            </div>
          )}
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

TextArea.displayName = 'TextArea';
