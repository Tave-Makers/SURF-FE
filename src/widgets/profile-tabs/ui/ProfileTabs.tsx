'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Tab } from '@/shared/ui/tab/Tab';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { TextArea } from '@/shared/ui/text-area/TextArea';
import { ActivityBadge } from '@/shared/ui/activity-badge/ActivityBadge';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import type { CareerDTO } from '@/entities/user/model/types';
import { useBadgesInfiniteQuery } from '@/entities/user/model/badge-queries';

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
  const [tab, setTab] = useState<'profile' | 'badges'>('profile');

  const { data, isFetchingNextPage, fetchNextPage, hasNextPage, refetch, status } =
    useBadgesInfiniteQuery(memberId, 9);

  useEffect(() => {
    if (tab === 'badges') {
      void refetch();
    }
  }, [tab, refetch]);

  // 무한스크롤 옵저버
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (tab !== 'badges') return;
    if (!loadMoreRef.current) return;

    const io = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
        void fetchNextPage();
      }
    });

    io.observe(loadMoreRef.current);
    return () => io.disconnect();
  }, [tab, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const badges = useMemo(() => data?.pages.flatMap((p) => p.content) ?? [], [data]);

  return (
    <>
      <Tab
        items={[
          { value: 'profile', label: '프로필' },
          { value: 'badges', label: '활동뱃지' },
        ]}
        value={tab}
        onValueChange={(v) => setTab(v as 'profile' | 'badges')}
      />

      <div className="flex flex-col">
        {tab === 'profile' ? (
          <div className="flex flex-col gap-[1.5rem] px-[1rem] py-[1.25rem]">
            <FieldGroup title="전화번호" isRequired>
              <TextArea value={phoneNumber ?? ''} onChange={() => {}} readOnly />
            </FieldGroup>

            <FieldGroup title="이메일" isRequired>
              <TextArea value={email ?? ''} onChange={() => {}} readOnly />
            </FieldGroup>

            <FieldGroup title="학교" isRequired>
              <TextArea value={university ?? ''} onChange={() => {}} readOnly />
              {graduateSchool ? (
                <TextArea value={graduateSchool ?? ''} onChange={() => {}} readOnly />
              ) : null}
            </FieldGroup>

            <FieldGroup title="경력" isRequired>
              {Array.isArray(careers) && careers.length > 0 ? (
                <ul className="flex flex-col gap-[0.5rem]">
                  {careers.map((c) => (
                    <li key={c.careerId ?? `${c.companyName}-${c.startDate}`}>
                      <CareerCard item={c} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </FieldGroup>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col">
            <div className="grid grid-cols-3 gap-[3rem] p-[2.5rem]">
              {badges.map((b, i) => (
                <ActivityBadge
                  key={`${b.badgeName}-${b.generation}-${b.awardedAt}-${i}`}
                  badgeName={b.badgeName}
                  timestamp={b.awardedAt}
                />
              ))}
            </div>

            <div ref={loadMoreRef} className="h-8" />

            {isFetchingNextPage && <div className="mt-2">더 불러오는 중...</div>}
            {!hasNextPage && status === 'success' && null}
          </div>
        )}
      </div>
    </>
  );
}
