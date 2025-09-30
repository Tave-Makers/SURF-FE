'use client';

import { Banner } from '@/shared/ui/banner/Banner';
import { SolidButton } from '@/shared/ui/solid-button/SolidButton';
import { useRouter } from 'next/navigation';

type Props = {
  isActiveMember: boolean;
};

export function MyPageActions({ isActiveMember }: Props) {
  const router = useRouter();

  return (
    <section className="flex flex-col gap-[1rem] px-[1rem] py-[1.25rem]">
      {isActiveMember && <Banner part="backend" score={100} onClickMore={() => {}} />}
      <SolidButton size="s" variant="secondary" onClick={() => router.push('/mypage/edit')}>
        프로필 편집
      </SolidButton>
    </section>
  );
}
