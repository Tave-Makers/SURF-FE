'use client';

import { ScoreMode } from '@/entities/activity-score/model/types';
import ActivityScoreCard from '@/widgets/activity-score/ui/ActivityScoreCard';
import { ActivityHistoryList } from '@/entities/activity-score/ui/ActivityHistoryList';
import { Tab } from '@/shared/ui/tab/Tab';
import { useActivitySummary } from '@/entities/activity-score/model/useActivitySummary';
import { useInfiniteActivityHistory } from '@/entities/activity-score/model/useActivityHistory';
import { useState, useRef, useEffect } from 'react';
import { trackActivityScoreEvent } from '@/features/activity-score/lib/trackActivityScoreEvent';
import { ACTIVITY_SCORE_EVENTS } from '@/features/activity-score/model/types';
import { usePageName } from '@/shared/analytics/lib/getPageName';
import RewardEmptyIcon from './icons/reward-empty.svg';
import PenaltyEmptyIcon from './icons/penalty-empty.svg';

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
  const pageName = usePageName();

  // 페이지 진입 시점에 이벤트 전송
  useEffect(() => {
    if (summary && !trackedRef.current) {
      trackActivityScoreEvent(ACTIVITY_SCORE_EVENTS.VIEW_ACTIVITY, {
        page_name: pageName,
      });
      trackActivityScoreEvent(ACTIVITY_SCORE_EVENTS.VIEW_PERSONAL_SCORE, {
        total_score: summary.score,
      });
      trackedRef.current = true;
    }
  }, [summary, pageName]);

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
  const isHistoryEmpty = !isHistoryLoading && !isHistoryError && history.length === 0;

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
      <div className="pt-17 pb-19">
        {isSummaryLoading && (
          <div aria-live="polite" aria-busy="true">
            불러오는 중...
          </div>
        )}
        {isSummaryError && (
          <div role="alert" className="flex flex-col items-center gap-[0.5rem]">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <button
              type="button"
              onClick={() => void refetchSummary()}
              className="bg-background-primary rounded px-[1rem] py-[0.5rem] text-white"
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

      {/* 활동 점수 상태 영역 */}
      {(isHistoryLoading || isHistoryError || isHistoryEmpty) && (
        <div className="flex flex-col items-center pt-20">
          {isHistoryLoading && (
            <div aria-live="polite" aria-busy="true" className="">
              불러오는 중...
            </div>
          )}

          {isHistoryError && (
            <div role="alert" className="flex flex-col items-center gap-[0.5rem]">
              <p>히스토리를 불러오는 중 오류가 발생했습니다.</p>
              <button
                type="button"
                onClick={() => void refetchHistory()}
                className="bg-background-primary rounded px-[1rem] py-[0.5rem] text-white"
              >
                다시 시도
              </button>
            </div>
          )}

          {isHistoryEmpty && (
            <div className="flex flex-col items-center gap-12">
              {mode === 'REWARD' ? (
                <>
                  <RewardEmptyIcon className="h-[60px] w-[60px]" />
                  <p className="text-body-body8 text-foreground-tertiary">
                    아직 등록된 상점이 없어요
                  </p>
                </>
              ) : (
                <>
                  <PenaltyEmptyIcon className="h-[60px] w-[60px]" />
                  <p className="text-body-body8 text-foreground-tertiary">
                    아직 등록된 벌점이 없어요
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* 활동 점수 리스트 */}
      {history.length > 0 && (
        <div className="flex w-full flex-1 flex-col gap-18 overflow-y-auto px-13 py-17">
          <ActivityHistoryList records={history} />

          {hasNextPage && (
            <div
              ref={loadMoreRef}
              className="text-body-body8 text-foreground-tertiary flex items-center justify-center py-[1rem]"
              aria-live="polite"
              aria-atomic="true"
            >
              {isFetchingNextPage ? '로딩 중...' : '스크롤 내려서 더 불러오기'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
