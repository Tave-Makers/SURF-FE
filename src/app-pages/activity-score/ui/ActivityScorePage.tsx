'use client';

import { ScoreMode, ActivityHistory } from '@/entities/activity-score/model/types';
import { useState } from 'react';
import ActivityScoreCard from '@/widgets/activity-score/ActivityScoreCard';
import { ActivityHistoryList } from '@/entities/activity-score/ui/ActivityHistoryList';
import { Tab } from '@/shared/ui/tab/Tab';
import { useActivitySummary } from '@/entities/activity-score/model/useActivitySummary';

// TODO: API 응답으로 변경
// const mockData: ActivitySummaryRecords = {
//   rewards: {
//     taveActivities: [
//       { activityType: 'UPLOAD_INSTAGRAM_STORY', count: 7 },
//       { activityType: 'ENGAGE_TECH_SEMINAR', count: 0 },
//       { activityType: 'EARLY_BIRD', count: 4 },
//     ],
//     blogs: {
//       totalCount: 2,
//       list: [
//         { activityType: 'WRITE_WIL', count: 1 },
//         { activityType: 'UPLOAD_TAVE_REVIEW', count: 1 },
//       ],
//     },
//   },
//   penalties: {
//     late: {
//       totalCount: 9,
//       list: [
//         { activityType: 'SESSION_LATE', count: 3 },
//         { activityType: 'TEAM_LATE', count: 6 },
//       ],
//     },
//     absence: {
//       totalCount: 4,
//       list: [
//         { activityType: 'SESSION_ABSENCE', count: 2 },
//         { activityType: 'TEAM_ABSENCE', count: 2 },
//       ],
//     },
//   },
// };

export const mockRewardRecords: ActivityHistory[] = [
  { memberId: 1, date: '26.09.06', category: '얼리버드', delta: 10, total: 136 },
  { memberId: 2, date: '26.09.05', category: '기술 블로그', delta: 20, total: 126 },
];

export const mockPenaltyRecords: ActivityHistory[] = [
  { memberId: 3, date: '26.09.04', category: '지각', delta: -3, total: 123 },
  { memberId: 4, date: '26.09.03', category: '결석', delta: -5, total: 118 },
];

export default function ActivityScorePage() {
  const [mode, setMode] = useState<ScoreMode>('REWARD');
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useActivitySummary(1); // TODO: memberId 실제 값으로 교체

  const records = mode === 'REWARD' ? mockRewardRecords : mockPenaltyRecords;

  return (
    <div className="flex flex-col items-center">
      {/* 활동 점수 카드 */}
      <div className="pt-[1.88rem] pb-[2.5rem]">
        {isSummaryLoading && <div>불러오는 중...</div>}
        {isSummaryError && <div>데이터를 불러오는 중 오류가 발생했습니다.</div>}
        {summary && (
          <ActivityScoreCard score={summary.score} records={summary.records} mode={mode} />
        )}
      </div>

      {/* 탭 버튼 */}
      <div className="w-full max-w-[400px]">
        <Tab
          items={[
            { value: 'REWARD', label: '상점' },
            { value: 'PENALTY', label: '벌점' },
          ]}
          value={mode}
          onValueChange={(v) => setMode(v as ScoreMode)}
        />
      </div>

      {/* 활동 점수 리스트 */}
      <div className="flex w-full px-[1rem] pt-[1.88rem]">
        <ActivityHistoryList records={records} />
      </div>
    </div>
  );
}
