'use client';

import { ReactNode } from 'react';

type FieldGroupProps = {
  title: string;
  isRequired?: boolean;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
};

export const FieldGroup = ({
  title,
  isRequired = false,
  children,
  className = '',
  headerRight,
}: FieldGroupProps) => {
  return (
    <fieldset className={`m-0 flex flex-col border-0 p-0 ${className}`} role="group">
      <div className="flex flex-row gap-5 pb-10">
        <legend className="text-title-title2 text-foreground-normal flex flex-row gap-5">
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
        {headerRight}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
};
