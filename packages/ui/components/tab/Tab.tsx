'use client';

import React, { useMemo, useState } from 'react';

interface TabItem {
  value: string;
  label: string;
}

interface TabProps {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
}

const baseStyle = 'flex w-full shadow-[inset_0_-1px_0_0_var(--color-border-normal)]';

const tabStyle =
  'relative flex-1 whitespace-nowrap p-10 text-body-body8 transition-colors' +
  ' after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full' +
  ' after:bg-foreground-normal after:origin-center after:scale-x-0' +
  ' after:transition-transform after:duration-200';

const activeStyle = 'text-foreground-normal after:scale-x-100';

const inactiveStyle = 'text-foreground-quaternary';

/**
 * 상단 탭 컴포넌트 (controlled / uncontrolled 지원)
 *
 * @param props - Tab 컴포넌트 props
 * @param props.items - 탭 목록 (value/label)
 * @param props.value - (controlled) 현재 활성 탭 value
 * @param props.defaultValue - (uncontrolled) 초기 활성 탭 value
 * @param props.onValueChange - 탭 변경 시 호출되는 콜백
 */
export const Tab = ({ items, value, defaultValue, onValueChange }: TabProps) => {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState(() => {
    const candidate = defaultValue ?? items[0]?.value;
    return items.some((i) => i.value === candidate) ? candidate : items[0]?.value;
  });

  const activeValue = useMemo(() => {
    const raw = isControlled ? value : internalValue;
    return items.some((i) => i.value === raw) ? raw : items[0]?.value;
  }, [isControlled, value, internalValue, items]);

  const handleChange = (v: string) => {
    onValueChange?.(v);
    if (!isControlled) setInternalValue(v);
  };

  return (
    <div className={baseStyle}>
      <div
        className="scrollbar-hide flex w-full overflow-x-auto"
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((item) => {
          const isActive = item.value === activeValue;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => handleChange(item.value)}
              role="tab"
              aria-selected={isActive}
              className={[tabStyle, isActive ? activeStyle : inactiveStyle].join(' ')}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
