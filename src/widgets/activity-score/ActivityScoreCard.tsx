'use client';

import { ActivityStatItem } from '@/entities/activity-score/ui/ActivityStatItem';
import { ActivityStatTooltip } from '@/entities/activity-score/ui/ActivityStatTooltip';
import { activityMetaMap, groupMetaMap } from '@/entities/activity-score/model/meta';
import { ActivityRecords, SingleActivity, Penalties } from '@/entities/activity-score/model/types';

type ActivityScoreCardProps = {
  score: number;
  records: ActivityRecords;
  tab: 'rewards' | 'penalties'; // 탭 상태
};

export default function ActivityScoreCard({ score, records, tab }: ActivityScoreCardProps) {
  return (
    <div className="flex flex-col gap-[2.5rem]">
      {/* 점수 표시 */}
      <div className="flex h-[3.37rem] items-center justify-center gap-[0.25rem]">
        <span className="text-head-48-700--2 text-foreground-normal">{score}</span>
        <span className="text-head-26-700--1 text-foreground-normal pt-[1.25rem]">점</span>
      </div>

      {/* 활동 아이콘 + 툴팁 */}
      {tab === 'rewards' && (
        <div className="flex justify-center gap-[1.5rem]">
          {/** 상점: 단일 활동 */}
          {records.rewards.taveActivities.map((item: SingleActivity) => {
            const meta = activityMetaMap[item.activityType];
            if (!meta?.Icon) return null;

            return (
              <ActivityStatItem
                key={item.activityType}
                id={item.activityType}
                icon={meta.Icon}
                count={item.count}
                tooltip={
                  <ActivityStatTooltip activities={[{ label: meta.label, count: item.count }]} />
                }
              />
            );
          })}

          {/** 상점: 블로그 그룹 */}
          <ActivityStatItem
            id="blogs"
            icon={groupMetaMap.blogs.Icon}
            count={records.rewards.blogs.totalCount}
            tooltip={
              <ActivityStatTooltip
                activities={records.rewards.blogs.list.map((c: SingleActivity) => ({
                  label: activityMetaMap[c.activityType]?.label ?? c.activityType,
                  count: c.count,
                }))}
              />
            }
          />
        </div>
      )}

      {tab === 'penalties' && (
        <div className="flex justify-center gap-[1.88rem]">
          {/** 벌점: 지각/결석 그룹 */}
          {(Object.keys(records.penalties) as (keyof Penalties)[]).map((groupId) => {
            const group = records.penalties[groupId];
            const meta = groupMetaMap[groupId];

            return (
              <ActivityStatItem
                key={groupId}
                id={groupId}
                icon={meta.Icon}
                count={group.totalCount}
                tooltip={
                  <ActivityStatTooltip
                    activities={group.list.map((c: SingleActivity) => ({
                      label: activityMetaMap[c.activityType]?.label ?? c.activityType,
                      count: c.count,
                    }))}
                  />
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
