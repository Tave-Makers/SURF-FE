'use client';

import { ScoreMode } from '@/entities/activity-score/model/types';
import ActivityScoreCard from '@/widgets/activity-score/ActivityScoreCard';
import { ActivityHistoryList } from '@/entities/activity-score/ui/ActivityHistoryList';
import { Tab } from '@/shared/ui/tab/Tab';
import { useActivitySummary } from '@/entities/activity-score/model/useActivitySummary';
import { useInfiniteActivityHistory } from '@/entities/activity-score/model/useActivityHistory';
import { useState, useRef, useEffect } from 'react';
import { trackActivityScoreEvent } from '@/features/activity-score/lib/trackActivityScoreEvent';

export default function ActivityScorePage() {
  // 탭 상태
  const [mode, setMode] = useState<ScoreMode>('REWARD');
  // sentinel ref
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 활동 요약 데이터
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useActivitySummary();

  // 이벤트 전송 여부를 확인하기 위한 ref
  const trackedRef = useRef(false);

  // 페이지 진입 시점에 이벤트 전송
  useEffect(() => {
    if (summary && !trackedRef.current) {
      trackActivityScoreEvent('personal_score_view', { total_score: summary.score });
      trackedRef.current = true;
    }
  }, [summary]);

  // 활동 히스토리 (무한스크롤)
  const {
    data: historyRaw,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError: isHistoryError,
    isLoading: isHistoryLoading,
    refetch: refetchHistory,
  } = useInfiniteActivityHistory(mode, 5);

  const history = historyRaw?.pages.flatMap((page) => page.content) ?? [];

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isFetchingNextPage) {
        void fetchNextPage().catch(console.error);
      }
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex h-full flex-col items-center">
      <h1 className="sr-only">활동 점수</h1>

      {/* 활동 점수 카드 */}
      <div className="pt-[1.88rem] pb-[2.5rem]">
        {isSummaryLoading && (
          <div aria-live="polite" aria-busy="true">
            불러오는 중...
          </div>
        )}
        {isSummaryError && (
          <div role="alert" className="flex flex-col items-center gap-2">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <button
              type="button"
              onClick={() => void refetchSummary()}
              className="bg-primary rounded px-4 py-2 text-white"
            >
              다시 시도
            </button>
          </div>
        )}
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
      <div className="flex w-full flex-1 flex-col gap-[2.25rem] overflow-y-auto px-[1rem] pt-[1.88rem]">
        {isHistoryLoading && (
          <div aria-live="polite" aria-busy="true">
            불러오는 중...
          </div>
        )}

        {isHistoryError && (
          <div role="alert" className="flex flex-col items-center gap-2">
            <p>히스토리를 불러오는 중 오류가 발생했습니다.</p>
            <button
              type="button"
              onClick={() => void refetchHistory()}
              className="bg-primary rounded px-4 py-2 text-white"
            >
              다시 시도
            </button>
          </div>
        )}

        {!isHistoryLoading && !isHistoryError && history.length === 0 && (
          <div className="text-body-14-600--1-20 text-foreground-hint text-center">
            활동 내역이 없습니다.
          </div>
        )}

        {history.length > 0 && <ActivityHistoryList records={history} />}

        {/* sentinel */}
        {hasNextPage && (
          <div
            ref={loadMoreRef}
            className="text-body-14-600--1-20 text-foreground-hint flex items-center justify-center py-[1rem]"
            aria-live="polite"
            aria-atomic="true"
          >
            {isFetchingNextPage ? '로딩 중...' : '스크롤 내려서 더 불러오기'}
          </div>
        )}
      </div>
    </div>
  );
}
