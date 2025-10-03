'use client';

import { ScoreMode } from '@/entities/activity-score/model/types';
import { useEffect, useRef, useState } from 'react';
import ActivityScoreCard from '@/widgets/activity-score/ActivityScoreCard';
import { ActivityHistoryList } from '@/entities/activity-score/ui/ActivityHistoryList';
import { Tab } from '@/shared/ui/tab/Tab';
import { useActivitySummary } from '@/entities/activity-score/model/useActivitySummary';
import { useInfiniteActivityHistory } from '@/entities/activity-score/model/useActivityHistory';

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
    isLoading: isHistoryLoading,
    isError: isHistoryError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteActivityHistory(mode, 5);

  const history = historyRaw?.pages.flatMap((page) => page.content) ?? [];

  // 무한스크롤 sentinel 역할 (리스트 맨 아래 DOM)
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver로 sentinel 감시
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPage().catch((err) => {
          console.error('fetchNextPage error:', err);
        });
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

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
      <div className="flex w-full px-[1rem] pt-[1.88rem]">
        {isHistoryLoading && (
          <div aria-live="polite" aria-busy="true">
            불러오는 중...
          </div>
        )}
        {isHistoryError && <div role="alert">데이터를 불러오는 중 오류가 발생했습니다.</div>}
        {history && <ActivityHistoryList records={history} />}
      </div>

      {/* 무한스크롤 sentinel*/}
      <div
        ref={loadMoreRef}
        className="text-body-14-600--1-20 text-foreground-hint flex items-center justify-center py-[1rem]"
        aria-live="polite"
        aria-atomic="true"
      >
        {isFetchingNextPage
          ? '로딩 중...'
          : hasNextPage
            ? '스크롤 내려서 더 불러오기'
            : '마지막 페이지'}
      </div>
    </div>
  );
}
