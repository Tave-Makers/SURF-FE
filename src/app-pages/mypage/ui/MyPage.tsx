'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { MyPageActions } from '@/widgets/mypage-actions/ui/MyPageActions';
import { ProfileBadge } from '@/widgets/profile-badge/ui/ProfileBadge';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';
import { PROFILE_EVENTS } from '@/features/profile/model/types';
import { trackProfileEvent } from '@/features/profile/lib/trackProfileEvent';
import type { UserProfile } from '@/entities/user/model/types';
import { FieldGroup } from '@/shared/ui/field-group/FieldGroup';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';

interface Props {
  userProfile: UserProfile;
}

export function MyPage({ userProfile }: Props) {
  const memberId = useAuthStore((s) => s.memberId);

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
    <div className="flex h-dvh flex-col overflow-y-auto">
      <ProfileHeader userProfile={userProfile} />

      <MyPageActions
        isActive={userProfile.isActive}
        bannerPart={userProfile.bannerPart}
        bannerScore={userProfile.activityScore}
      />
      <section className="flex flex-col gap-16 px-13 pt-16">
        <div className="flex flex-col gap-10">
          <FieldGroup title="경력">
            {userProfile.careers.length > 0 && (
              <ul className="flex flex-col gap-10">
                {userProfile.careers.map((c) => (
                  <li key={c.careerId ?? `${c.companyName}-${c.startDate}`}>
                    <CareerCard item={c} />
                  </li>
                ))}
              </ul>
            )}
          </FieldGroup>
        </div>
      </section>
      <ProfileBadge />
    </div>
  );
}
