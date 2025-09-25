'use client';

import { ActivityRecords } from '@/entities/activity-score/model/types';
import { useState } from 'react';
import ActivityScoreCard from '@/widgets/activity-score/ActivityScoreCard';

// TODO: API 응답으로 변경
const mockData: ActivityRecords = {
  rewards: {
    taveActivities: [
      { activityType: 'UPLOAD_INSTAGRAM_STORY', count: 7 },
      { activityType: 'ENGAGE_TECH_SEMINAR', count: 0 },
      { activityType: 'EARLY_BIRD', count: 4 },
    ],
    blogs: {
      totalCount: 2,
      list: [
        { activityType: 'WRITE_WIL', count: 1 },
        { activityType: 'UPLOAD_TAVE_REVIEW', count: 1 },
      ],
    },
  },
  penalties: {
    late: {
      totalCount: 9,
      list: [
        { activityType: 'SESSION_LATE', count: 3 },
        { activityType: 'TEAM_LATE', count: 6 },
      ],
    },
    absence: {
      totalCount: 4,
      list: [
        { activityType: 'SESSION_ABSENCE', count: 2 },
        { activityType: 'TEAM_ABSENCE', count: 2 },
      ],
    },
  },
};

export default function ActivityScorePage() {
  const [tab, setTab] = useState<'rewards' | 'penalties'>('rewards');

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* 탭 버튼 */}
      <div className="flex gap-4">
        <button
          className={`cursor-pointer rounded px-4 py-2 ${
            tab === 'rewards' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setTab('rewards')}
        >
          상점
        </button>
        <button
          className={`cursor-pointer rounded px-4 py-2 ${
            tab === 'penalties' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setTab('penalties')}
        >
          벌점
        </button>
      </div>

      {/* 활동 점수 카드 */}
      <ActivityScoreCard score={156} records={mockData} tab={tab} />
    </div>
  );
}
