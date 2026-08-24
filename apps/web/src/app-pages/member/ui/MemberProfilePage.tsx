'use client';

import { SolidButton } from '@surf/ui/button';
import { FieldGroup } from '@surf/ui/field-group';
import { HeaderMode, type HeaderProps } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/entities/user/model/types';
import { CareerCard } from '@/entities/user/ui/career-card/CareerCard';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useMemberOptions } from '@/features/block';
import CareerEmpty from '@/shared/assets/icons/empty-space/career-empty.svg';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
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
  const openMemberOptionSheet = useMemberOptions(memberId, {
    onReport: () => router.push(PAGE_ROUTES.MEMBER.REPORT(memberId)),
  });

  // (sub) 레이아웃의 AppHeader는 routes.tsx에 항목이 없어야 렌더되지 않는다.
  // 헤더를 이 페이지가 직접 그리므로 뒤로가기도 여기서 처리한다.
  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(PAGE_ROUTES.MEMBER.MEMBER_SEARCH);
  };

  const overrideHeader: HeaderProps = {
    mode: HeaderMode.Default,
    hasLeftIcon: true,
    icons: isMe ? [] : [{ label: 'Dots', onClickIcon: openMemberOptionSheet }],
  };

  function handleMessage() {
    if (isMe) return;

    router.push(
      PAGE_ROUTES.MESSAGE({
        memberId,
        nickname: userProfile.username,
        profileImageUrl: userProfile.profileImgUrl,
      }),
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader customBack={handleBack} overrideHeader={overrideHeader} />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <ProfileHeader userProfile={userProfile} />
        <div className="w-full px-13">
          <SolidButton size="s" variant="secondary" onClick={handleMessage} isDisabled={isMe}>
            쪽지 보내기
          </SolidButton>
        </div>
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
        <ProfileBadge memberId={memberId} />
      </div>
    </div>
  );
};
