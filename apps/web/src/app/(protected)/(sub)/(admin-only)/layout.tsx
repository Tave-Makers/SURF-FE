import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';
import { PAGE_ROUTES } from '@/shared/config/path';
import { verifySession } from '@/shared/lib/dal';

const AdminOnlyLayout = async ({ children }: { children: ReactNode }) => {
  const user = await verifySession();
  if (user.memberRole === 'member') redirect(PAGE_ROUTES.UNAUTHORIZED);
  return <>{children}</>;
};

export default AdminOnlyLayout;
