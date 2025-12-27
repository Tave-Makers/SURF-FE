'use client';

import { ReactNode } from 'react';

type FieldGroupProps = {
  title: string;
  isRequired?: boolean;
  children: ReactNode;
  className?: string;
};

export const FieldGroup = ({
  title,
  isRequired = false,
  children,
  className = '',
}: FieldGroupProps) => {
  return (
    <fieldset className={`m-0 flex flex-col border-0 p-0 ${className}`} role="group">
      <legend className="text-title-title2 text-foreground-normal pb-10">
        {title}
        {isRequired && (
          <>
            <span aria-hidden="true" className="text-foreground-danger">
              *
            </span>
            <span className="sr-only">(필수)</span>
          </>
        )}
      </legend>
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
};
