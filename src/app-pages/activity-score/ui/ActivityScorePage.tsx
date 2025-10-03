'use client';

import { ScoreMode } from '@/entities/activity-score/model/types';
import ActivityScoreCard from '@/widgets/activity-score/ActivityScoreCard';
import { ActivityHistoryList } from '@/entities/activity-score/ui/ActivityHistoryList';
import { Tab } from '@/shared/ui/tab/Tab';
import { useActivitySummary } from '@/entities/activity-score/model/useActivitySummary';
import { useInfiniteActivityHistory } from '@/entities/activity-score/model/useActivityHistory';
import { useState } from 'react';

export default function ActivityScorePage() {
  // 탭 상태
  const [mode, setMode] = useState<ScoreMode>('REWARD');

  // 활동 요약 데이터
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
  } = useActivitySummary();

  // 활동 히스토리 (무한스크롤)
  const {
    data: historyRaw,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteActivityHistory(mode, 5);

  const history = historyRaw?.pages.flatMap((page) => page.content) ?? [];

  return (
    <div className="flex flex-col items-center">
      <h1 className="sr-only">활동 점수</h1>

      {/* 활동 점수 카드 */}
      <div className="pt-[1.88rem] pb-[2.5rem]">
        {isSummaryLoading && (
          <div aria-live="polite" aria-busy="true">
            불러오는 중...
          </div>
        )}
        {isSummaryError && <div role="alert">데이터를 불러오는 중 오류가 발생했습니다.</div>}
        {summary && (
          <ActivityScoreCard score={summary.score} records={summary.records} mode={mode} />
        )}
      </div>

      {/* 탭 버튼 */}
      <div className="w-full max-w-[400px]" role="tablist" aria-label="활동 유형">
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
      <ActivityHistoryList
        records={history}
        hasNextPage={hasNextPage ?? false}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => void fetchNextPage().catch(console.error)}
      />
    </div>
  );
}
