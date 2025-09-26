'use client';

import { ReactNode } from 'react';

type FieldGroupProps = {
  title: string;
  isRequired?: boolean;
  children: ReactNode;
  className?: string;
};

export const FieldGroup = ({ title, isRequired, children, className = '' }: FieldGroupProps) => {
  return (
    <div className={`flex flex-col gap-[0.625rem] ${className}`}>
      <label className="text-body-16-600--1 text-foreground-normal">
        {title}
        {isRequired && <span className="text-body-16-600--1 text-foreground-danger">*</span>}
      </label>
      <div className="flex flex-col gap-[0.25rem]">{children}</div>
    </div>
  );
};
