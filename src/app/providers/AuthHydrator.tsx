'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { UserLevel } from '@/entities/user/model/types';
import { mapUserLevel } from '@/entities/user/model/mappers';

export function AuthHydrator({
  memberId,
  memberRole,
}: {
  memberId: number;
  memberRole: UserLevel;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const mappedRole = mapUserLevel(memberRole);

    setAuth({ memberId, memberRole: mappedRole });
  }, [memberId, memberRole, setAuth]);

  return null;
}
