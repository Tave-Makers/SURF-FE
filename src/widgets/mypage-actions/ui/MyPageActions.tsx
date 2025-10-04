'use client';

import { Banner } from '@/shared/ui/banner/Banner';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import { useRouter } from 'next/navigation';
import type { BannerPart } from '@/entities/user/model/mappers';

type Props = {
  isActive: boolean;
  bannerPart: BannerPart | null;
  bannerScore: number;
};

export function MyPageActions({ isActive, bannerPart, bannerScore }: Props) {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-[1.25rem] px-[1rem] pb-[1.25rem]">
      {isActive && bannerPart && (
        <Banner
          part={bannerPart}
          score={bannerScore}
          onClickMore={() => router.push('/mypage/activity-score')}
        />
      )}
      <SolidButton size="s" variant="secondary" onClick={() => router.push('/mypage/edit')}>
        프로필 편집
      </SolidButton>
    </section>
  );
}
