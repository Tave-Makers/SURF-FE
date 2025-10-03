import { ActivityHistory } from '../model/types';
import { ActivityHistoryItem } from './ActivityHistoryItem';
import { useRef, useEffect } from 'react';

type ActivityHistoryListProps = {
  records: ActivityHistory[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
};

export const ActivityHistoryList = ({
  records,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: ActivityHistoryListProps) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // IntersectionObserver로 sentinel 감시
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) onLoadMore();
    });

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  return (
    <div className="flex w-full flex-col gap-[2.25rem] px-[1rem] py-[1.88rem]">
      {records.map((record, idx) => (
        <ActivityHistoryItem
          key={`${record.memberId}-${record.date}-${record.category}-${record.activity}-${idx}`}
          date={record.date}
          category={record.category}
          activity={record.activity}
          delta={record.delta}
          total={record.total}
        />
      ))}

      {/* 무한스크롤 sentinel*/}
      {hasNextPage && (
        <div
          ref={loadMoreRef}
          className="text-body-14-600--1-20 text-foreground-hint flex items-center justify-center py-[1rem]"
        >
          {isFetchingNextPage ? '로딩 중...' : '스크롤 내려서 더 불러오기'}
        </div>
      )}
    </div>
  );
};
