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
    <div className="flex w-full px-[1.25rem]">
      <div className="border-border-secondary flex w-full border-b-[1px]">
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              onClick={() => handleChange(item.value)}
              className={[
                'text-body-14-600--1-20 flex-1 p-[0.625rem] transition-colors',
                isActive
                  ? 'border-foreground-normal text-foreground-normal border-b-[2px]'
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
