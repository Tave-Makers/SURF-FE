'use client';

// import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { dedupeAndSortBadges } from '../model/utils';
import { ActivityBadge } from './ActivityBadge';
import { useBadges } from '@/entities/user/model/useBadges';
import ActivityBadgeEmpty from '@/shared/assets/icons/empty-space/activity-badge-empty.svg';

// const ActivityBadgeEmpty = dynamic(
//   () => import('@/shared/assets/icons/empty-space/activity-badge-empty.svg'),
//   {
//     ssr: false,
//       loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
//   },
// );

interface Props {
  memberId?: number; // 없으면 내 배지
}

export const ProfileBadge = ({ memberId }: Props) => {
  const { data, isLoading } = useBadges({
    memberId,
    enabled: memberId != null,
  });

  const badges = useMemo(() => {
    const list = data ?? [];
    return dedupeAndSortBadges(list);
  }, [data]);

  const isWaitingMemberId = memberId == null;

  return (
    <section className="flex flex-col gap-16 px-13 py-13 pt-16">
      <div className="flex flex-col gap-10">
        <h2 className="text-title-title2 text-foreground-normal">활동 배지</h2>
        {!isWaitingMemberId && !isLoading ? (
          <>
            {badges.length > 0 ? (
              <div className="flex flex-col items-center gap-13">
                {badges.map((b) => (
                  <ActivityBadge
                    key={`${b.badgeId}-${b.awardedAt}`}
                    src={b.badgeImageUrl}
                    alt={b.description || b.badgeName}
                    badgeName={b.badgeName}
                    timestamp={b.awardedAt}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-16">
                <ActivityBadgeEmpty aria-hidden="true" />
                <span className="text-body-body8 text-foreground-tertiary">
                  부여받은 활동 배지가 없어요
                </span>
              </div>
            )}
          </>
        ) : null}
      </div>
    </section>
  );
};
