'use client';

import { ActivityBadge } from '@surf/ui/activity-badge';
// import dynamic from 'next/dynamic';
import { useMemo, useRef } from 'react';
import { dedupeAndSortBadges } from '../model/utils';
import { useInfiniteBadges } from '@/entities/user/model/useInfiniteBadges';
import ActivityBadgeEmpty from '@/shared/assets/icons/empty-space/activity-badge-empty.svg';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

// const ActivityBadgeEmpty = dynamic(
//   () => import('@/shared/assets/icons/empty-space/activity-badge-empty.svg'),
//   {
//     ssr: false,
//       loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
//   },
// );

interface Props {
  memberId?: number; // 없으면 내 뱃지
}

export const ProfileBadge = ({ memberId }: Props) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } = useInfiniteBadges({
    memberId,
    pageSize: 9,
  });

  const badges = useMemo(() => {
    const list = data?.pages.flatMap((p) => p.content) ?? [];
    return dedupeAndSortBadges(list);
  }, [data]);

  const loadMoreRef = useInfiniteScroll({
    enabled: !isLoading,
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: () => void fetchNextPage(),
  });

  return (
    <section ref={contentRef} className="flex flex-col gap-16 px-13 pt-16">
      <div className="flex flex-col gap-10">
        <h2 className="text-title-title2 text-foreground-normal">활동 뱃지</h2>
        {!isLoading ? (
          <>
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-20 p-6">
                {badges.map((b) => (
                  <ActivityBadge
                    key={`${b.badgeName}-${b.generation}-${b.awardedAt}`}
                    badgeName={b.badgeName}
                    timestamp={b.awardedAt}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 pt-16">
                <ActivityBadgeEmpty aria-hidden="true" />
                <span className="text-body-body8 text-foreground-tertiary">
                  아직 활동뱃지는 준비 중이에요.
                </span>
              </div>
            )}

            {hasNextPage ? <div ref={loadMoreRef} className="h-8" /> : null}

            {isFetchingNextPage ? (
              <div className="text-foreground-secondary mt-2 px-6 text-sm">더 불러오는 중...</div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
};
