'use client';

import { useEffect, useRef, useState } from 'react';
import { SurfIcon } from '../icon/SurfIcon';
import { AccordionProps } from './types';

/**
 * 단일 아코디언 컴포넌트.
 * - index를 넘기면 "1. 제목"처럼 넘버링된 UI를 표시
 * - index를 생략하면 제목만 표시
 * - renderTitle을 사용하면 타이틀 렌더링을 원하는 대로 커스터마이징 가능
 */

export function Accordion({
  index,
  title,
  defaultOpen = false,
  isDisabled = false,
  children,
  renderTitle,
  onToggle,
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [maxHeight, setMaxHeight] = useState('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    const next = !isOpen;
    setIsOpen(next);
    onToggle?.(next); // 토글 상태 변화를 외부에 알림
  };

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen]);

  return (
    <div
      className={`border-b ${
        isDisabled
          ? 'border-border-normal bg-background-quinary'
          : isOpen
            ? 'border-none'
            : 'border-border-quaternary'
      } `}
    >
      <button
        type="button"
        disabled={isDisabled}
        onClick={handleToggle}
        className="disabled:bg-background-quinary text-foreground-normal text-body-body6 flex w-full cursor-pointer items-center justify-between p-13 disabled:cursor-not-allowed"
      >
        <span>
          {renderTitle
            ? renderTitle(index, title)
            : index !== undefined
              ? `${index}. ${title}`
              : title}
        </span>
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <SurfIcon name="ChevronDown" size="l" />
        </span>
      </button>

      <div
        ref={contentRef}
        style={{ maxHeight }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div className="px-13 py-15">{children}</div>
      </div>
    </div>
  );
}
