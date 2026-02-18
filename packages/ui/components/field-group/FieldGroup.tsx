'use client';

import { ReactNode } from 'react';

type FieldGroupProps = {
  title: string;
  titleClassName?: string;
  isRequired?: boolean;
  children: ReactNode;
  className?: string;
  headerRight?: ReactNode;
};

export const FieldGroup = ({
  title,
  titleClassName = '',
  isRequired = false,
  children,
  className = '',
  headerRight,
}: FieldGroupProps) => {
  return (
    <fieldset className={`m-0 flex flex-col border-0 p-0 ${className}`} role="group">
      <div className="flex flex-row gap-5 pb-10">
        <span
          className={`text-title-title2 text-foreground-normal flex flex-row gap-5 ${titleClassName}`}
        >
          {title}
          {isRequired && (
            <>
              <span aria-hidden="true" className="text-foreground-danger">
                *
              </span>
              <span className="sr-only">(필수)</span>
            </>
          )}
        </span>
        {headerRight}
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </fieldset>
  );
};
