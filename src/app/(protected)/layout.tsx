import type { ReactNode } from 'react';
import { verifySession } from '@/shared/lib/dal';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  await verifySession();
  return <>{children}</>;
}
