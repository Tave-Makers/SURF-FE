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
    <fieldset className={`m-0 flex flex-col gap-[0.625rem] border-0 p-0 ${className}`} role="group">
      <legend className="text-body-16-600--1 text-foreground-normal">
        {title}
        {isRequired && (
          <>
            <span aria-hidden="true" className="text-body-16-600--1 text-foreground-danger">
              *
            </span>
            <span className="sr-only">(필수)</span>
          </>
        )}
      </legend>
      <div className="flex flex-col gap-[0.25rem]">{children}</div>
    </fieldset>
  );
};
