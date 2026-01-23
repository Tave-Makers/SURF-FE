import type { ComponentType, SVGProps } from 'react';
import type { UserLevel } from '@/entities/user/model/types';

import ManagerBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import AdminBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import PresidentBadge from '@/shared/assets/icons/profile/manager-badge.svg';

export const USER_LEVEL_BADGE: Record<UserLevel, ComponentType<SVGProps<SVGSVGElement>> | null> = {
  admin: AdminBadge,
  president: PresidentBadge,
  manager: ManagerBadge,
  member: null,
};
