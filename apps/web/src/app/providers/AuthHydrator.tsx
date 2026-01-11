'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { UserLevel } from '@/entities/user/model/types';

export function AuthHydrator({
  memberId,
  memberRole,
}: {
  memberId: number;
  memberRole: UserLevel;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    setAuth({ memberId, memberRole });
  }, [memberId, memberRole, setAuth]);

  return null;
}
