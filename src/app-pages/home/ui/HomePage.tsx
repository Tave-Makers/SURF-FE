import React from 'react';
import { SurfIcon } from '@/shared/ui/Icon/SurfIcon';

export const HomePage = () => {
  return (
    <div>
      <h1 className="text-head-26-700--1 text-background-primary">안녕하세요 hello world</h1>
      <h1 className="text-caption-9-600--4 text-foreground-success">안녕하세요 hello world</h1>

      {/* 기본(stroke) 아이콘 */}
      <SurfIcon
        name="SmileCircle"
        size="m"
        className="cursor-pointer text-[color:var(--color-foreground-success)] hover:text-[color:var(--color-foreground-danger)]"
      />

      {/* Solid 아이콘 */}
      <SurfIcon
        name="SmileCircleSolid"
        size="l"
        className="cursor-pointer text-[color:var(--color-foreground-primary)] hover:text-[color:var(--color-foreground-warning)]"
      />
    </div>
  );
};
