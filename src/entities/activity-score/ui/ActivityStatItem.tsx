'use client';

import { useTooltipStore } from '@/entities/activity-score/model/tooltipStore';
import { FC, ReactNode } from 'react';

type Props = {
  id: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  count: number;
  tooltip?: ReactNode;
};

export const ActivityStatItem: FC<Props> = ({ id, icon: Icon, count, tooltip }) => {
  const { activeId, show } = useTooltipStore();
  const showTooltip = activeId === id;

  return (
    <button
      className="relative flex cursor-pointer items-center gap-8"
      onClick={() => show(id, 1500)}
    >
      <Icon width="1.5rem" height="1.5rem" />
      <span className="text-body-body9 text-foreground-normal">{count}회</span>
      {tooltip && showTooltip && (
        <div className="absolute bottom-full mb-[0.25rem] w-max">{tooltip}</div>
      )}
    </button>
  );
};
