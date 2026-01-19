import type { ReactNode } from 'react';
// import { AuthHydrator } from '../providers/AuthHydrator';
// import { verifySession } from '@/shared/lib/dal';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  // const user = await verifySession();
  return (
    <>
      {/* <AuthHydrator memberId={user.memberId} memberRole={user.memberRole} /> */}
      {children}
    </>
  );
};

export default ProtectedLayout;
