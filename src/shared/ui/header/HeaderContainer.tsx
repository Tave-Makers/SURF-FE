'use client';

import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { createRouteConfig } from '@/shared/config/routes';

type HeaderContainerProps = {
  routeId: string;
};

export function HeaderContainer({ routeId }: HeaderContainerProps) {
  const router = useRouter();
  const ROUTE_CONFIG = createRouteConfig(router);

  const config = ROUTE_CONFIG.find((r) => r.id === routeId);
  if (!config) return null;

  return <Header {...config.header} />;
}
