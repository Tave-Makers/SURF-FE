'use client';

import { ActivityScoreBanner } from '@/shared/ui/banner/ActivityScoreBanner';
import { SolidButton } from '@/shared/ui/button';
import { useRouter } from 'next/navigation';
import type { BannerPart } from '@/entities/user/model/types';

interface Props {
  isActive: boolean;
  bannerPart: BannerPart | null;
  bannerScore: number;
}

const ROUTE_MYPAGE_ACTIVITY_SCORE = '/mypage/activity-score';
const ROUTE_MYPAGE_EDIT = '/mypage/edit';

export function MyPageActions({ isActive, bannerPart, bannerScore }: Props) {
  const router = useRouter();
  const handleRouter = () => router.push(ROUTE_MYPAGE_EDIT);

  return (
    <section className="flex flex-col gap-13 px-13 pt-11 pb-13">
      {isActive && bannerPart && (
        <ActivityScoreBanner
          part={bannerPart}
          score={bannerScore}
          onClickMore={() => router.push(ROUTE_MYPAGE_ACTIVITY_SCORE)}
        />
      )}
      <SolidButton size="s" variant="secondary" onClick={handleRouter}>
        프로필 편집
      </SolidButton>
    </section>
  );
}
