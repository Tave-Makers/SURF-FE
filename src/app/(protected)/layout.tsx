import type { ReactNode } from 'react';
import { verifySession } from '@/shared/lib/dal';
import { AuthHydrator } from '../providers/AuthHydrator';

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const user = await verifySession();
  return (
    <>
      <AuthHydrator memberId={user.memberId} memberRole={user.memberRole} />
      {children}
    </>
  );
}
