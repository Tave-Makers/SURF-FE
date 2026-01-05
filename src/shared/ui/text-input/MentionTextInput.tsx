'use client';

import { forwardRef, useRef, useImperativeHandle } from 'react';
import { TextInput, type TextInputProps } from './TextInput';

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
  ({ value, defaultValue, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    useImperativeHandle(ref, () => internalRef.current!);

    const currentValue = value ?? defaultValue?.toString() ?? '';

    return (
      <div className="relative h-full w-full min-w-0">
        {/* 강조 레이어 */}
        <div
          aria-hidden="true"
          className="text-body-body6 pointer-events-none absolute inset-0 z-0 py-7 pr-8 pl-11 break-words whitespace-pre-wrap"
          style={{ color: 'transparent' }}
        >
          {mentionedText(currentValue)}
          {currentValue.endsWith('\n') ? '\n ' : ''}
        </div>

        {/* 원본 TextInput */}
        <TextInput
          {...props}
          ref={internalRef}
          value={value}
          defaultValue={defaultValue}
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
