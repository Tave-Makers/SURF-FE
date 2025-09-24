'use client';

import { useState } from 'react';

type TabItem = {
  value: string;
  label: string;
};

type TabProps = {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
};

export function Tab({ items, value, defaultValue, onValueChange }: TabProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? items[0]?.value);
  const activeValue = value ?? internalValue;

  const handleChange = (v: string) => {
    if (onValueChange) {
      onValueChange(v);
    } else {
      setInternalValue(v);
    }
  };

  return (
    <div className="flex w-full shadow-[inset_0_-1px_0_0_var(--color-border-secondary)]">
      <div className="flex w-full px-[1.25rem]">
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              onClick={() => handleChange(item.value)}
              className={[
                'text-body-14-600--1-20 flex-1 p-[0.625rem] transition-colors',
                isActive
                  ? 'text-foreground-normal after:bg-foreground-normal relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full'
                  : 'text-foreground-hint',
              ].join(' ')}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
