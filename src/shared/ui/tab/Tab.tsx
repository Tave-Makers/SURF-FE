'use client';

import { useEffect, useState } from 'react';

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
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(() => {
    const candidate = defaultValue ?? items[0]?.value;
    return items.some((i) => i.value === candidate) ? candidate : items[0]?.value;
  });

  const activeValue = isControlled ? value : internalValue;

  const handleChange = (v: string) => {
    onValueChange?.(v);
    if (!isControlled) {
      setInternalValue(v);
    }
  };

  useEffect(() => {
    if (!isControlled && !items.some((i) => i.value === internalValue)) {
      setInternalValue(items[0]?.value);
    }
  }, [items, isControlled, internalValue]);

  return (
    <div className="flex w-full shadow-[inset_0_-1px_0_0_var(--color-border-secondary)]">
      <div className="flex w-full px-[1rem]">
        {items.map((item) => {
          const isActive = item.value === activeValue;
          return (
            <button
              key={item.value}
              onClick={() => handleChange(item.value)}
              className={[
                'text-body-body7 flex-1 p-10 transition-colors',
                isActive
                  ? 'text-foreground-normal after:bg-foreground-normal relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full'
                  : 'text-foreground-quaternary',
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
