'use client';

import { useRouter, usePathname } from 'next/navigation';
import { BottomNavigation } from '@/shared/ui/bottom-navigation/BottomNavigation';
import { ROUTE_CONFIG } from '@/shared/config/routes';

export function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 활성화된 메뉴 ID 계산
  const activeId = ROUTE_CONFIG.find((item) => pathname === item.path)?.id ?? 'home';

  const handleNavigate = (id: string) => {
    const target = ROUTE_CONFIG.find((item) => item.id === id);
    if (target) router.push(target.path);
  };

  return <BottomNavigation activeId={activeId} onNavigate={handleNavigate} />;
}
