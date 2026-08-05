'use client';

import { forwardRef, useRef, useImperativeHandle, useState } from 'react';
import { TextInput, TextInputProps } from '..';

function mentionedText(text: string) {
  const parts = text.split(/(@[^\s@]+\s)/g);

  return parts.map((part, i) => {
    // 공백으로 끝나는 @멘션인 경우에만 primary 색상 적용
    if (part.startsWith('@') && part.endsWith(' ')) {
      return (
        <span key={i} className="text-background-primary">
          {part}
        </span>
      );
    }
    // 일반 텍스트나 입력 중인 @키워드
    return (
      <span key={i} className="text-foreground-normal">
        {part}
      </span>
    );
  });
}

export const MentionTextInput = forwardRef<HTMLTextAreaElement, TextInputProps>(
  ({ value, defaultValue, onChange, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);
    const normalizedDefault =
      typeof defaultValue === 'string' || typeof defaultValue === 'number'
        ? defaultValue.toString()
        : '';
    const [internalValue, setInternalValue] = useState(normalizedDefault);
    const currentValue = value ?? internalValue;

    const handleChange = (next: string) => {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    };

    return (
      <div className="relative h-full w-full min-w-0">
        {/* 강조 레이어 */}
        <div
          aria-hidden="true"
          className="text-body-body7 pointer-events-none absolute inset-0 z-0 whitespace-pre-wrap break-words py-7 pl-11 pr-8"
          style={{ color: 'transparent' }}
        >
          {mentionedText(currentValue)}
          {currentValue.endsWith('\n') ? '\n ' : ''}
        </div>

        {/* 원본 TextInput */}
        <TextInput
          {...props}
          ref={internalRef}
          value={currentValue}
          onChange={handleChange}
          style={{
            color: 'transparent',
            caretColor: 'var(--color-foreground-normal)',
            backgroundColor: 'transparent',
            position: 'relative',
            zIndex: 10,
          }}
        />
      </div>
    );
  },
);

MentionTextInput.displayName = 'MentionTextInput';
