'use client';

import { useTooltipStore } from '@/entities/activity-score/model/tooltipStore';
import { FC, ReactNode } from 'react';

type ActivitySummaryItemProps = {
  id: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  count: number;
  tooltip?: ReactNode;
};

export const ActivitySummaryItem: FC<ActivitySummaryItemProps> = ({
  id,
  icon: Icon,
  count,
  tooltip,
}) => {
  const { activeId, show } = useTooltipStore();
  const showTooltip = activeId === id;

  return (
    <button
      type="button"
      className="relative flex cursor-pointer items-center gap-[0.5rem]"
      aria-describedby={tooltip && showTooltip ? `${id}-tooltip` : undefined}
      onClick={() => show(id, 1500)}
    >
      <Icon width="1.5rem" height="1.5rem" />
      <span className="text-body-14-400--2-22 text-foreground-normal">{count}회</span>
      {tooltip && showTooltip && (
        <div
          id={`${id}-tooltip`}
          role="tooltip"
          className="absolute bottom-full mb-[0.25rem] w-max"
        >
          {tooltip}
        </div>
      )}
    </button>
  );
};
