'use client';

import { Banner } from '@/shared/ui/banner/Banner';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import { useRouter } from 'next/navigation';
import type { BannerPart } from '@/entities/user/model/types';

type Props = {
  isActive: boolean;
  bannerPart: BannerPart | null;
  bannerScore: number;
};

const ROUTE_MYPAGE_ACTIVITY_SCORE = '/mypage/activity-score';
const ROUTE_MYPAGE_EDIT = '/mypage/edit';

export function MyPageActions({ isActive, bannerPart, bannerScore }: Props) {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-[1.25rem] px-[1rem] pb-[1.25rem]">
      {isActive && bannerPart && (
        <Banner
          part={bannerPart}
          score={bannerScore}
          onClickMore={() => router.push(ROUTE_MYPAGE_ACTIVITY_SCORE)}
        />
      )}
      <SolidButton size="s" variant="secondary" onClick={() => router.push(ROUTE_MYPAGE_EDIT)}>
        프로필 편집
      </SolidButton>
    </section>
  );
}
