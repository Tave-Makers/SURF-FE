'use client';

import { FieldGroup } from '@surf/ui/field-group';
// import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import type { UserProfile } from '@/entities/user/model/types';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { trackProfileEvent } from '@/features/profile/lib/trackProfileEvent';
import { PROFILE_EVENTS } from '@/features/profile/model/types';
import CareerEmpty from '@/shared/assets/icons/empty-space/career-empty.svg';
import { MyPageActions } from '@/widgets/mypage-actions/ui/MyPageActions';
import { ProfileBadge } from '@/widgets/profile-badge/ui/ProfileBadge';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';

// const CareerEmpty = dynamic(() => import('@/shared/assets/icons/empty-space/career-empty.svg'), {
//   ssr: false,
//     loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
// });

interface Props {
  userProfile: UserProfile;
}

export const MyPage = ({ userProfile }: Props) => {
  const memberId = useAuthStore((s) => s.memberId);
  const isManager = userProfile.level !== 'member';

  // 중복 로그 방지 (StrictMode에서 useEffect 2번 도는 것 대비)
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    fired.current = true;

    trackProfileEvent(PROFILE_EVENTS.VIEW_PROFILE, {
      member_id: memberId != null ? String(memberId) : 'anonymous',
    });
  }, [memberId]);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <ProfileHeader userProfile={userProfile} />

      <MyPageActions
        isActive={userProfile.isActive}
        bannerPart={userProfile.bannerPart}
        bannerScore={userProfile.activityScore}
        isManager={isManager}
      />
      <section className="flex flex-col gap-16 px-13 pt-16">
        <div className="flex flex-col gap-10">
          <FieldGroup title="경력">
            {userProfile.careers.length > 0 ? (
              <ul className="flex flex-col gap-10">
                {userProfile.careers.map((c) => (
                  <li key={c.careerId ?? `${c.companyName}-${c.startDate}`}>
                    <CareerCard item={c} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center gap-3 py-16">
                <CareerEmpty aria-hidden="true" />
                <span className="text-body-body8 text-foreground-tertiary">
                  등록된 경력이 없어요
                </span>
              </div>
            )}
          </FieldGroup>
        </div>
      </section>
      <ProfileBadge />
    </div>
  );
};
