'use client';

import { Fab } from '@surf/ui/fab';
import { useRouter } from 'next/navigation';
import { PAGE_ROUTES } from '@/shared/config/path';
import { BadgeListWidget } from '@/widgets/badge/ui/BadgeListWidget';

export const BadgeListPage = () => {
  const router = useRouter();

  return (
    <div className="bg-background-normal relative flex h-full min-h-0 w-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto pb-28">
        <BadgeListWidget />
      </div>

      <div className="pointer-events-none absolute inset-0 z-50">
        <div className="pointer-events-auto absolute right-15 bottom-15">
          <Fab
            ariaLabel="신규 뱃지 생성 버튼"
            onClick={() => router.push(PAGE_ROUTES.BADGE_MNG.CREATE)}
          />
        </div>
      </div>
    </div>
  );
};
