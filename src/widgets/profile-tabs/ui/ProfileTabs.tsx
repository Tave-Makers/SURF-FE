'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Tab } from '@/shared/ui/tab/Tab';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { ActivityBadge } from '@/shared/ui/activity-badge/ActivityBadge';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import type { CareerDTO } from '@/entities/user/model/types';
import { useBadgesInfiniteQuery } from '@/entities/user/model/badgeQueries';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { PROFILE_EVENTS } from '@/features/profile/model/types';
import { trackProfileEvent } from '@/features/profile/lib/trackProfileEvent';
import { BADGE_EVENTS } from '@/features/activity-badges/model/types';
import { trackBadgeEvent } from '@/features/activity-badges/lib/trackBadgeEvent';

type Props = {
  phoneNumber: string;
  email: string;
  university: string;
  graduateSchool?: string | null;
  careers: CareerDTO[];
  memberId?: number; // 없으면 내 정보로 처리
};

export function ProfileTabs({
  phoneNumber,
  email,
  university,
  graduateSchool,
  careers,
  memberId,
}: Props) {
  const noop = () => {};
  const [tab, setTab] = useState<'profile' | 'badges'>('profile');

  const myMemberId = useAuthStore((s) => s.memberId);
  const effectiveMemberId = useMemo(() => memberId ?? myMemberId ?? null, [memberId, myMemberId]);

  const prevTabRef = useRef<'profile' | 'badges'>('profile');

  useEffect(() => {
    const prev = prevTabRef.current;

    if (prev !== 'badges' && tab === 'badges') {
      trackBadgeEvent(BADGE_EVENTS.VIEW_BADGE, {
        member_id: effectiveMemberId != null ? String(effectiveMemberId) : 'anonymous',
      });
    }

    if (prev === 'badges' && tab === 'profile') {
      trackProfileEvent(PROFILE_EVENTS.VIEW_PROFILE, {
        member_id: effectiveMemberId != null ? String(effectiveMemberId) : 'anonymous',
      });
    }

    prevTabRef.current = tab;
  }, [tab, effectiveMemberId]);

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage, refetch } =
    useBadgesInfiniteQuery(memberId, 9);

  // 탭 컨텐츠 스크롤 컨테이너 & 센티넬
  const contentRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // 뱃지 탭 진입 시 최신화
  useEffect(() => {
    if (tab === 'badges') void refetch();
  }, [tab, refetch]);

  // 무한스크롤 옵저버
  useEffect(() => {
    if (tab !== 'badges' || !loadMoreRef.current || !hasNextPage) return;
    const rootEl = contentRef.current;
    if (!rootEl) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      {
        root: rootEl, // 탭 아래 스크롤 컨테이너 기준
        rootMargin: '200px',
        threshold: 0.01,
      },
    );

    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [tab, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 뱃지 중복 제거 + 최신순 정렬
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

  const badgeKey = (
    b: { badgeName?: string; generation?: string | number; awardedAt?: string },
    i: number,
  ) => `${b.badgeName ?? 'noname'}-${b.generation ?? 'gen'}-${b.awardedAt ?? 'na'}-${i}`;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="sticky top-0 z-10">
        <Tab
          items={[
            { value: 'profile', label: '프로필' },
            { value: 'badges', label: '활동뱃지' },
          ]}
          value={tab}
          onValueChange={(v) => setTab(v as 'profile' | 'badges')}
        />
      </div>

      <div ref={contentRef} className="scroll-touch min-h-0 flex-1 overflow-y-auto">
        {tab === 'profile' ? (
          <div className="flex flex-col gap-[1.5rem] px-[1rem] py-[1.25rem]">
            <FieldGroup title="전화번호">
              <TextArea value={phoneNumber ?? ''} onChange={noop} readOnly />
            </FieldGroup>

            <FieldGroup title="이메일">
              <TextArea value={email ?? ''} onChange={noop} readOnly />
            </FieldGroup>

            <FieldGroup title="학교">
              <TextArea value={university ?? ''} onChange={noop} readOnly />
              {graduateSchool ? (
                <TextArea value={graduateSchool ?? ''} onChange={noop} readOnly />
              ) : null}
            </FieldGroup>

            <FieldGroup title="경력">
              {Array.isArray(careers) && careers.length > 0 ? (
                <ul className="flex flex-col gap-[0.5rem]">
                  {careers.map((c) => (
                    <li key={c.careerId ?? `${c.companyName}-${c.startDate}`}>
                      <CareerCard item={c} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p
                  className="text-foreground-hint text-[0.875rem] leading-[1.25rem]"
                  role="status"
                  aria-live="polite"
                >
                  경력이 없습니다
                </p>
              )}
            </FieldGroup>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col">
            {!isLoading && (
              <>
                {Array.isArray(badges) && badges.length > 0 ? (
                  <div className="grid grid-cols-3 gap-[3rem] p-[2.5rem]">
                    {badges.map((b, i) => (
                      <ActivityBadge
                        key={badgeKey(b, i)}
                        badgeName={b.badgeName}
                        timestamp={b.awardedAt}
                      />
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-foreground-hint text-[0.875rem] leading-[1.25rem]"
                    role="status"
                    aria-live="polite"
                  >
                    활동뱃지가 없습니다
                  </p>
                )}

                {/* 다음 페이지 있을 때만 센티넬 렌더 */}
                {hasNextPage ? <div ref={loadMoreRef} className="h-8" /> : null}

                {/* 추가 로딩 표시 */}
                {isFetchingNextPage && (
                  <div className="mt-2 px-[2.5rem]" role="status" aria-live="polite">
                    더 불러오는 중...
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
