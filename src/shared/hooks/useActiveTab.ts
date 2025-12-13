'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { BOTTOM_NAV_ITEMS, TabId } from '@/shared/config/bottom-nav';

export function useActiveTab(): TabId {
  const pathname = usePathname();

  const activeTabId = useMemo<TabId>(() => {
    if (!pathname) return 'home';

    const segments = pathname.split('/');
    const currentRoot = segments.length > 1 ? `/${segments[1]}` : '/';

    const activeItem = BOTTOM_NAV_ITEMS.find((item) =>
      item.relatedRoots.some((root) => root === currentRoot),
    );

    return activeItem?.id ?? 'home';
  }, [pathname]);

  return activeTabId;
}
