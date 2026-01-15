'use client';

import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/entities/user/model/types';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { PAGE_ROUTES } from '@/shared/config/path';
import { ProfileBadge } from '@/widgets/profile-badge/ui/ProfileBadge';
import { ProfileHeader } from '@/widgets/profile-header/ui/ProfileHeader';

interface Props {
  userProfile: UserProfile;
  memberId: number;
}

export const MemberProfilePage = ({ userProfile, memberId }: Props) => {
  const router = useRouter();
  const myId = useAuthStore((s) => s.memberId);
  const isMe = myId != null && myId === memberId;

  function handleMessage() {
    if (isMe) return;

    const params = new URLSearchParams({
      memberId: String(memberId),
      nickname: userProfile.username,
      profileImageUrl: userProfile.profileImgUrl,
    });

    router.push(`${PAGE_ROUTES.MESSAGE}?${params.toString()}`);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <ProfileHeader userProfile={userProfile} />
      <div className="w-full px-13">
        <SolidButton size="s" variant="secondary" onClick={handleMessage} isDisabled={isMe}>
          쪽지 보내기
        </SolidButton>
      </div>
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
};
