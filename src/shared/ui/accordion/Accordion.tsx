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
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [maxHeight, setMaxHeight] = useState('0px');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setMaxHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setMaxHeight('0px');
    }
  }, [isOpen]);

  return (
    <div className={`${isOpen ? '' : 'border-border-normal border-b'}`}>
      <button
        disabled={isDisabled}
        onClick={() => setIsOpen(!isOpen)}
        className="disabled:bg-background-quaternary text-foreground-normal text-body-16-600--1 flex w-full cursor-pointer items-center justify-between p-[1rem] disabled:cursor-not-allowed"
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
        <div className="px-[1rem] py-[1.25rem]">{children}</div>
      </div>
    </div>
  );
}
