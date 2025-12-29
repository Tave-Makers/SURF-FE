'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { MyPageActions } from '@/widgets/mypage-actions/ui/MyPageActions';
import { ProfileCareer } from '@/widgets/profile-career/ui/ProfileCareer';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';
import { PROFILE_EVENTS } from '@/features/profile/model/types';
import { trackProfileEvent } from '@/features/profile/lib/trackProfileEvent';
import type { UserProfile } from '@/entities/user/model/types';

interface Props {
  userProfile: UserProfile;
}

export function MyPage({ userProfile }: Props) {
  const memberId = useAuthStore((s) => s.memberId);

  // 중복 로그 방지 (StrictMode에서 useEffect 2번 도는 것 대비)
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (!userProfile) return;

    fired.current = true;

    trackProfileEvent(PROFILE_EVENTS.VIEW_PROFILE, {
      member_id: memberId != null ? String(memberId) : 'anonymous',
    });
  }, [userProfile, memberId]);

  if (!userProfile) return <div className="p-4">프로필을 불러오지 못했어요.</div>;

  return (
    <div className="flex h-dvh flex-col overflow-y-auto">
      <ProfileHeader userProfile={userProfile} />

      <MyPageActions
        isActive={userProfile.isActive}
        bannerPart={userProfile.bannerPart}
        bannerScore={userProfile.activityScore}
      />

      {userProfile.careers && <ProfileCareer careers={userProfile.careers} />}
    </div>
  );
}
