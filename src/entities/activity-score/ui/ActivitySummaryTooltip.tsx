'use client';

import { FC } from 'react';

type ActivitySummaryTooltipProps = {
  activities: { label: string; count: number }[];
};

export const ActivitySummaryTooltip: FC<ActivitySummaryTooltipProps> = ({ activities }) => {
  return (
    <div className="bg-background-normal flex w-full flex-col items-start rounded-[0.25rem] px-[0.62rem] py-[0.37rem] shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
      {activities.map((a, i) => (
        <div key={i} className="text-caption-10-400--1 text-foreground-normal">
          {a.label} {a.count}회
        </div>
      ))}
    </div>
  );
};
