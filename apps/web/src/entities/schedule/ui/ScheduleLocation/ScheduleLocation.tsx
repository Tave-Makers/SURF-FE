'use client';

import { useState, useRef, useEffect } from 'react';

export type ScheduleLocationProps = {
  title: string;
  placeholder: string;
  location?: string;
  onChange?: (value: string) => void;
};

export const ScheduleLocation = ({
  title,
  placeholder,
  location,
  onChange,
}: ScheduleLocationProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(location || '');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setValue(location || '');
  }, [location]);

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

  const isEmpty = !value || value.trim() === '';
  const displayValue = isEmpty ? placeholder : value;

  if (isEditing) {
    return (
      <div className="flex h-18 w-full flex-row items-center justify-between py-10">
        <div className="text-foreground-normal text-body-body9 flex shrink-0">{title}</div>
        <div className="flex flex-1 justify-end">
          <textarea
            ref={inputRef}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleTextAreaKeyDown}
            maxLength={45}
            className={`text-caption-caption2 w-full resize-none border-none bg-transparent text-right outline-none ${
              isEmpty ? 'text-foreground-quaternary' : 'text-foreground-normal'
            }`}
            rows={1}
            style={{ overflow: 'hidden', height: 'auto' }}
            onInput={(e) => {
              const target = e.currentTarget;
              target.style.height = 'auto';
              target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="flex h-18 w-full cursor-pointer flex-row items-center justify-between py-10"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="text-foreground-normal text-body-body9 flex shrink-0">{title}</div>

      <div
        className={`text-caption-caption2 line-clamp-1 flex shrink-0 ${
          isEmpty ? 'text-foreground-quaternary' : 'text-foreground-normal'
        }`}
      >
        {displayValue}
      </div>
    </button>
  );
};
