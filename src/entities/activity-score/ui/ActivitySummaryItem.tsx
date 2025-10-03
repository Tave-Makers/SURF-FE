'use client';

import { useTooltipStore } from '@/entities/activity-score/model/tooltipStore';
import { FC, ReactNode, useEffect } from 'react';

type ActivitySummaryItemProps = {
  id: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  count: number;
  label?: string;
  tooltip?: ReactNode;
};

export const ActivitySummaryItem: FC<ActivitySummaryItemProps> = ({
  id,
  icon: Icon,
  count,
  label,
  tooltip,
}) => {
  const { activeId, show, hide } = useTooltipStore();
  const showTooltip = activeId === id;

  useEffect(() => {
    return () => {
      hide(); // 언마운트 시 타이머 정리
    };
  }, [hide]);

  return (
    <button
      type="button"
      aria-label={`${label ?? '활동'} ${count}회, 상세 정보 보기`}
      aria-expanded={showTooltip}
      aria-describedby={showTooltip ? `tooltip-${id}` : undefined}
      className="relative flex cursor-pointer items-center gap-[0.5rem]"
      onClick={() => show(id, 1500)}
      onFocus={() => show(id, 1500)}
      onBlur={() => hide()}
      onMouseEnter={() => show(id, 1500)}
      onMouseLeave={() => hide()}
    >
      <Icon width="1.5rem" height="1.5rem" />
      <span className="text-body-14-400--2-22 text-foreground-normal">{count}회</span>
      {tooltip && showTooltip && (
        <div
          id={`tooltip-${id}`}
          role="tooltip"
          className="absolute bottom-full mb-[0.25rem] w-max"
        >
          {tooltip}
        </div>
      )}
    </button>
  );
};
