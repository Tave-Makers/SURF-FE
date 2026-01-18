import type { ReactNode } from 'react';
import { verifySession } from '@/shared/lib/dal';
// import { AuthHydrator } from '../providers/AuthHydrator';

const ProtectedLayout = async ({ children }: { children: ReactNode }) => {
  await verifySession();
  return (
    <>
      {/* <AuthHydrator memberId={user.memberId} memberRole={user.memberRole} /> */}
      {children}
    </>
  );
};

export default ProtectedLayout;
