'use client';

import { HeaderMode } from '@surf/ui/header';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BadgeManageWidget } from '@/widgets/badge/ui/BadgeManageWidget';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type BadgeEditPageProps = {
  badgeId: number;
};

export const BadgeEditPage = ({ badgeId }: BadgeEditPageProps) => {
  const router = useRouter();

  return (
    <>
      <AppHeader
        customBack={() => router.push(PAGE_ROUTES.BADGE_MNG.DETAIL(badgeId))}
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '활동 배지 관리',
          hasLeftIcon: true,
        }}
      />
      <BadgeManageWidget badgeId={badgeId} mode="edit" />
    </>
  );
};
