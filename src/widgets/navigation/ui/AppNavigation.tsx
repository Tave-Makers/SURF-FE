'use client';

import { useRouter, usePathname } from 'next/navigation';
import { BottomNavigation } from '@/shared/ui/bottom-navigation/BottomNavigation';
import { useActiveTab } from '@/shared/hooks/useActiveTab';
import { BOTTOM_NAV_ITEMS } from '@/shared/config/bottom-nav';

export function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const activeId = useActiveTab();

  const handleNavigate = (id: string) => {
    const targetPath = BOTTOM_NAV_ITEMS.find((item) => item.id === id)?.path;

    // 현재 페이지와 같지 않을 때만 이동
    if (targetPath && pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  return <BottomNavigation activeId={activeId} onNavigate={handleNavigate} />;
}
