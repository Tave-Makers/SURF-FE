'use client';

import { ActivitySummaryItem } from '@/entities/activity-score/ui/ActivitySummaryItem';
import { ActivitySummaryTooltip } from '@/entities/activity-score/ui/ActivitySummaryTooltip';
import { activityMetaMap, groupMetaMap } from '@/entities/activity-score/model/meta';
import {
  ActivitySummaryRecords,
  SingleActivitySummary,
  ScoreMode,
  PenaltySummary,
} from '@/entities/activity-score/model/types';

type ActivityScoreCardProps = {
  score: number;
  records: ActivitySummaryRecords;
  mode: ScoreMode; // 탭 상태
};

export default function ActivityScoreCard({ score, records, mode }: ActivityScoreCardProps) {
  return (
    <section aria-labelledby="activity-score-title" className="flex flex-col gap-[2.5rem]">
      {/* 점수 표시 */}
      <h2 className="flex h-[3.37rem] items-center justify-center gap-[0.25rem]">
        <span id="activity-score-title" className="sr-only">
          현재 활동 점수
        </span>
        <span className="text-head-48-700--2 text-foreground-normal">{score}</span>
        <span className="text-head-26-700--1 text-foreground-normal pt-[1.25rem]">점</span>
      </h2>

      {/* 활동 아이콘 + 툴팁 */}
      {mode === 'REWARD' && (
        <div className="flex justify-center gap-[1.5rem]" role="list" aria-label="상점 활동 목록">
          {/** 상점: 단일 활동 */}
          {records.rewards.taveActivities.map((item: SingleActivitySummary) => {
            const meta = activityMetaMap[item.activityType];
            if (!meta?.Icon) return null;

            return (
              <div role="listitem" key={item.activityType}>
                <ActivitySummaryItem
                  id={item.activityType}
                  icon={meta.Icon}
                  count={item.count}
                  label={meta.label}
                  tooltip={
                    <ActivitySummaryTooltip
                      activities={[{ label: meta.label, count: item.count }]}
                    />
                  }
                />
              </div>
            );
          })}

          {/** 상점: 블로그 그룹 */}
          <div role="listitem">
            <ActivitySummaryItem
              id="blogs"
              icon={groupMetaMap.blogs.Icon}
              count={records.rewards.blogs.totalCount}
              label={groupMetaMap.blogs.label}
              tooltip={
                <ActivitySummaryTooltip
                  activities={records.rewards.blogs.list.map((c: SingleActivitySummary) => ({
                    label: activityMetaMap[c.activityType]?.label ?? c.activityType,
                    count: c.count,
                  }))}
                />
              }
            />
          </div>
        </div>
      )}

      {mode === 'PENALTY' && (
        <div className="flex justify-center gap-[1.88rem]" role="list" aria-label="벌점 활동 목록">
          {/** 벌점: 지각/결석 그룹 */}
          {(Object.keys(records.penalties) as (keyof PenaltySummary)[]).map((groupId) => {
            const group = records.penalties[groupId];
            const meta = groupMetaMap[groupId];

            if (!meta?.Icon) {
              console.warn(`Missing meta for penalty group: ${groupId}`);
              return null;
            }

            return (
              <div role="listitem" key={groupId}>
                <ActivitySummaryItem
                  id={groupId}
                  icon={meta.Icon}
                  count={group.totalCount}
                  label={meta.label}
                  tooltip={
                    <ActivitySummaryTooltip
                      activities={group.list.map((c: SingleActivitySummary) => ({
                        label: activityMetaMap[c.activityType]?.label ?? c.activityType,
                        count: c.count,
                      }))}
                    />
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
