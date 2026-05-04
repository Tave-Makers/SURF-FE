'use client';

import { HeaderMode } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BadgeManageWidget } from '@/widgets/badge/ui/BadgeManageWidget';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type BadgeDetailPageProps = {
  badgeId: number;
};

export const BadgeDetailPage = ({ badgeId }: BadgeDetailPageProps) => {
  const router = useRouter();

  return (
    <>
      <AppHeader
        customBack={() => router.push(PAGE_ROUTES.BADGE_MNG.LIST)}
        overrideHeader={{
          mode: HeaderMode.TextBtn,
          title: '활동 뱃지 관리',
          hasLeftIcon: true,
          text: '수정',
          btnVariant: 'primary',
          onClickTextBtn: () => router.push(PAGE_ROUTES.BADGE_MNG.EDIT(badgeId)),
        }}
      />
      <BadgeManageWidget badgeId={badgeId} mode="detail" />
    </>
  );
};
