'use client';

// import { useState } from 'react';
import { useParams } from 'next/navigation';
// import { UserLevel } from '@/entities/user/model/types';
import { ProfileTabs } from '@/widgets/profile-tabs/ui/ProfileTabs';
// import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';

export function ProfilePage() {
  const params = useParams();
  const memberId = params?.memberId ? Number(params.memberId) : undefined;
  // const [userLevel] = useState<UserLevel>('manager');

  return (
    <div className="flex flex-col">
      {/*<ProfileHeader name="김테이비" level={userLevel} chips={['13기 백엔드', '13기 프론트엔드']} />*/}
      <ProfileTabs
        phoneNumber="010-1234-5678"
        email="test@example.com"
        university="테이비대학교"
        graduateSchool="테이비대학원"
        careers={[]}
        memberId={memberId}
      />
    </div>
  );
}
