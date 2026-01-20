'use client';

import { SolidButton } from '@surf/ui/button';
import { useRouter } from 'next/navigation';
import type { TrackPart } from '@/entities/user/model/types';
import { ActivityScoreBanner } from '@/entities/user/ui/activity-score-banner/ActivityScoreBanner';
import { PAGE_ROUTES } from '@/shared/config/path';

interface Props {
  isActive: boolean;
  bannerPart: TrackPart | null;
  bannerScore: number;
  isManager: boolean;
}

export const MyPageActions = ({ isActive, bannerPart, bannerScore, isManager }: Props) => {
  const router = useRouter();
  const handleEditClick = () => router.push(PAGE_ROUTES.MYPAGE.EDIT);
  const handlePwClick = () => router.push(PAGE_ROUTES.MYPAGE.PASSWORD);

  return (
    <section className="flex flex-col gap-13 px-13 pt-11">
      {isActive && bannerPart && (
        <ActivityScoreBanner
          part={bannerPart}
          score={bannerScore}
          onClickMore={() => router.push(PAGE_ROUTES.MYPAGE.ACTIVITY_SCORE.MAIN)}
        />
      )}

      <SolidButton size="s" variant="secondary" onClick={handleEditClick}>
        프로필 편집
      </SolidButton>
      {isManager && (
        <SolidButton size="s" variant="secondary" onClick={handlePwClick}>
          비밀번호 설정
        </SolidButton>
      )}
    </section>
  );
};
