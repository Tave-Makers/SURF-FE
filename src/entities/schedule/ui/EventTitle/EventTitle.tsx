'use client';

import { useState, useRef, useEffect } from 'react';

export type EventTitleProps = {
  placeholder: string;
  title: string;
  onChange?: (value: string) => void;
};

export function EventTitle({ placeholder, title, onChange }: EventTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(title || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(title || '');
  }, [title]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        inputRef.current.value.length,
        inputRef.current.value.length,
      );
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange?.(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value.replace(/\n/g, ' ');
    setValue(newValue);
  };

  const handleTextAreaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <div className="text-body-body3 flex w-full flex-col gap-10 self-stretch">
        <textarea
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleTextAreaKeyDown}
          className="text-foreground-foreground-normal w-full resize-none border-none bg-transparent outline-none"
          rows={1}
          style={{ overflow: 'hidden', height: 'auto' }}
          onInput={(e) => {
            const target = e.currentTarget;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}
        />
      </div>
    );
  }

  const isEmpty = !value || value.trim() === '';
  const displayValue = isEmpty ? placeholder : value;
  const hasValue = !isEmpty;

  return (
    <button
      type="button"
      className="text-body-body3 flex w-full cursor-pointer flex-col gap-10 self-stretch text-left"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {hasValue ? (
        <div className="text-foreground-foreground-normal">{displayValue}</div>
      ) : (
        <div className="text-foreground-foreground-quaternary">{displayValue}</div>
      )}
    </button>
  );
}
