'use client';

import { useMemo, useRef } from 'react';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { ActivityBadge } from '@/shared/ui/activity-badge/ActivityBadge';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import type { CareerDTO } from '@/entities/user/model/types';
import { useInfiniteBadges } from '@/entities/user/model/useInfiniteBadges';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';
import { dedupeAndSortBadges } from '../model/utils';

interface Props {
  careers: CareerDTO[];
  memberId?: number; // 없으면 내 뱃지
}

export function ProfileBadge({ careers, memberId }: Props) {
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
      <FieldGroup title="경력">
        {careers.length > 0 ? (
          <ul className="flex flex-col gap-10">
            {careers.map((c) => (
              <li key={c.careerId ?? `${c.companyName}-${c.startDate}`}>
                <CareerCard item={c} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-foreground-quaternary text-[0.875rem] leading-15">경력이 없습니다</p>
        )}
      </FieldGroup>

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
              <p className="text-foreground-quaternary text-[0.875rem] leading-15">
                활동뱃지가 없습니다
              </p>
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
}
