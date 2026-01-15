'use client';

import { useEffect } from 'react';
import { mapUserLevel } from '@/entities/user/model/mappers';
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
    const mappedRole = mapUserLevel(memberRole);

    setAuth({ memberId, memberRole: mappedRole });
  }, [memberId, memberRole, setAuth]);

  return null;
};
