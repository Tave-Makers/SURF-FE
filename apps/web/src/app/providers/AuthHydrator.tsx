'use client';

import { useEffect } from 'react';
import { UserLevel } from '@/entities/user/model/types';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export const AuthHydrator = ({
  memberId,
  memberRole,
}: {
  memberId: number;
  memberRole: UserLevel;
}) => {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    setAuth({ memberId, memberRole });
  }, [memberId, memberRole, setAuth]);

  return null;
};
