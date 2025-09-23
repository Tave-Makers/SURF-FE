'use client';

import { useEffect, useRef, useState } from 'react';
import { SurfIcon } from '../icon/SurfIcon';
import { AccordionProps } from './types';

export function Accordion({
  index,
  title,
  defaultOpen = false,
  isDisabled = false,
  children,
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
          {index}. {title}
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
        <div className="bg-background-tertiary mx-[1rem] my-[1.25rem] space-y-[1.5rem] rounded-[0.62rem] px-[1rem] py-[1.25rem]">
          {children}
        </div>
      </div>
    </div>
  );
}
