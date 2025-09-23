'use client';

import { ActivityStatItem } from '@/entities/activity-score/ui/ActivityStatItem';
import { ActivityStatTooltip } from '@/entities/activity-score/ui/ActivityStatTooltip';
import { activityMetaMap } from '@/entities/activity-score/model/meta';
import { ActivityRecords } from '@/entities/activity-score/model/types';

type ActivityScoreCardProps = {
  score: number; // 활동점수
  records: ActivityRecords; // 활동타입과 횟수
};

export default function ActivityScoreCard({ score, records }: ActivityScoreCardProps) {
  const { singleList, group } = records;

  return (
    <div className="flex flex-col gap-[2.5rem]">
      <div className="flex h-[3rem] items-end justify-center gap-[0.25rem]">
        <span className="text-head-26-700--1">{score}</span>
        <span className="text-head-26-700--1">점</span>
      </div>
      <div className="flex justify-center gap-[1.5rem]">
        {/* 단일 활동 - 인스타 스토리, 기술 세미나 참석, 얼리버드 */}
        {singleList.map((item, idx) => {
          const meta = activityMetaMap[item.activityType];
          if (!meta?.Icon) return null;

          return (
            <ActivityStatItem
              key={idx}
              id={item.activityType}
              icon={meta.Icon}
              label={meta.label}
              count={item.count}
              tooltip={
                <ActivityStatTooltip
                  activities={[
                    {
                      label: meta.label,
                      count: item.count,
                    },
                  ]}
                />
              }
            />
          );
        })}

        {/* 그룹 활동 - 기술 블로그 작성, 활동 후기 작성 */}
        {/* NOTE: group 2개 이상이 될 시 group의 activityType 응답에서 필요 */}
        <ActivityStatItem
          id="CONTENT_UPLOAD"
          icon={activityMetaMap['CONTENT_UPLOAD'].Icon!}
          label={activityMetaMap['CONTENT_UPLOAD'].label}
          count={group.totalCount}
          tooltip={
            <ActivityStatTooltip
              activities={group.list.map((c) => ({
                label: activityMetaMap[c.activityType]?.label ?? c.activityType,
                count: c.count,
              }))}
            />
          }
        />
      </div>
    </div>
  );
}
