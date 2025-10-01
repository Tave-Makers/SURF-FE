'use client';

import { useRouter, usePathname } from 'next/navigation';
import { BottomNavigation } from '@/shared/ui/bottom-navigation/BottomNavigation';
import { createRouteConfig } from '@/shared/config/routes';

export function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  // 현재 활성화된 메뉴 ID 계산
  // 추후 not found page 추가
  const activeId =
    createRouteConfig(router).find(
      (item) => pathname === item.path || pathname.startsWith(`${item.path}/`),
    )?.id ?? 'home';

  const handleNavigate = (id: string) => {
    const target = createRouteConfig(router).find((item) => item.id === id);
    if (target && pathname !== target.path) router.push(target.path);
  };

  return <BottomNavigation activeId={activeId} onNavigate={handleNavigate} />;
}
