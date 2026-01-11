'use client';

import { FC } from 'react';

type ActivitySummaryTooltipProps = {
  activities: { label: string; count: number }[];
};

export const ActivitySummaryTooltip: FC<ActivitySummaryTooltipProps> = ({ activities }) => {
  return (
    <div className="bg-background-normal rounded-3 flex w-full flex-col items-start px-10 py-7 shadow-[0_0_10px_0_rgba(0,0,0,0.08)]">
      {activities.map((a, i) => (
        <div key={i} className="text-caption-caption6 text-foreground-normal">
          {a.label} {a.count}회
        </div>
      ))}
    </div>
  );
};
