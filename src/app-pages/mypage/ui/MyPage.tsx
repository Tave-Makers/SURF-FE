'use client';

import { useEffect, useRef } from 'react';
import { useMyProfileQuery } from '@/entities/user/model/profileQueries';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { MyPageActions } from '@/widgets/mypage-actions/ui/MyPageActions';
import { ProfileTabs } from '@/widgets/profile-tabs/ui/ProfileTabs';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';
import { PROFILE_EVENTS } from '@/features/profile/model/types';
import { trackProfileEvent } from '@/features/profile/lib/trackProfileEvent';

export function MyPage() {
  const { data: profile, isLoading, isError } = useMyProfileQuery();
  const memberId = useAuthStore((s) => s.memberId);

  // 중복 로그 방지
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    if (!profile) return;

    fired.current = true;

    trackProfileEvent(PROFILE_EVENTS.VIEW_PROFILE, {
      member_id: memberId != null ? String(memberId) : 'anonymous',
    });
  }, [profile, memberId]);

  if (isLoading) return <div className="p-4">로딩...</div>;
  if (isError || !profile) return <div className="p-4">프로필을 불러오지 못했어요.</div>;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ProfileHeader name={profile.name} level={profile.level} chips={profile.chips} />
      <MyPageActions
        isActive={profile.isActive}
        bannerPart={profile.bannerPart}
        bannerScore={profile.activityScore}
      />
      <div className="min-h-0 flex-1">
        <ProfileTabs
          phoneNumber={profile.phoneNumber ?? ''}
          email={profile.email ?? ''}
          university={profile.university ?? ''}
          graduateSchool={profile.graduateSchool ?? ''}
          careers={profile.careers ?? []}
        />
      </div>
    </div>
  );
}
