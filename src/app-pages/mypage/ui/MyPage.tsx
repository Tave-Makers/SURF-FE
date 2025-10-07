'use client';

import { MyPageActions } from '@/widgets/mypage-actions/ui/MyPageActions';
import { ProfileTabs } from '@/widgets/profile-tabs/ui/ProfileTabs';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';
import { useMyProfileQuery } from '@/entities/user/model/profile-queries';

export function MyPage() {
  const { data: profile, isLoading, isError } = useMyProfileQuery();

  if (isLoading) return <div className="p-4">로딩...</div>; // 추후 수정 필요
  if (isError || !profile) return <div className="p-4">프로필을 불러오지 못했어요.</div>; // 추후 수정 필요

  return (
    <div className="flex h-full flex-col">
      <ProfileHeader name={profile.name} level={profile.level} chips={profile.chips} />
      <MyPageActions
        isActive={profile.isActive}
        bannerPart={profile.bannerPart}
        bannerScore={profile.activityScore}
      />
      <ProfileTabs
        phoneNumber={profile.phoneNumber ?? ''}
        email={profile.email ?? ''}
        university={profile.university ?? ''}
        graduateSchool={profile.graduateSchool ?? ''}
        careers={profile.careers ?? []}
      />
    </div>
  );
}
