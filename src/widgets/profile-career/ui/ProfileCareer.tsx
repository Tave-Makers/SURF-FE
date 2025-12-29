'use client';

import { useEffect, useMemo, useRef } from 'react';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { ActivityBadge } from '@/shared/ui/activity-badge/ActivityBadge';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import type { CareerDTO } from '@/entities/user/model/types';
import { useBadgesInfiniteQuery } from '@/entities/user/model/badgeQueries';

interface Props {
  careers: CareerDTO[];
  memberId?: number;
}

export function ProfileCareer({ careers, memberId }: Props) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useBadgesInfiniteQuery(memberId, 9);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;
    const rootEl = contentRef.current;
    if (!rootEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root: rootEl,
        rootMargin: '200px',
        threshold: 0.01,
      },
    );

    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const badges = useMemo(() => {
    const list = data?.pages.flatMap((p) => p.content) ?? [];
    const seen = new Set<string>();
    const deduped: typeof list = [];

    for (const b of list) {
      const sig = `${b.badgeName ?? ''}|${b.generation ?? ''}|${b.awardedAt ?? ''}`;
      if (!seen.has(sig)) {
        seen.add(sig);
        deduped.push(b);
      }
    }

    deduped.sort((a, b) => (b.awardedAt ?? '').localeCompare(a.awardedAt ?? ''));
    return deduped;
  }, [data]);

  return (
    <section className="flex flex-col gap-16 px-13 pt-16">
      {/* TODO: 빈 화면 적용 */}
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

        {!isLoading && (
          <>
            {badges.length > 0 ? (
              <div className="grid grid-cols-3 gap-20 p-6">
                {badges.map((b, i) => (
                  <ActivityBadge
                    key={`${b.badgeName}-${b.generation}-${b.awardedAt}-${i}`}
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

            {isFetchingNextPage && (
              <div className="text-foreground-secondary mt-2 px-6 text-sm">더 불러오는 중...</div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
