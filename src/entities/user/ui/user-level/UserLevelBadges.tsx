import type { ComponentType, SVGProps } from 'react';
import type { UserLevel } from '@/entities/user/model/types';

import ManagerBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import SuperManagerBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import ExecutiveBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import MemberBadge from '@/shared/assets/icons/profile/manager-badge.svg';

export const USER_LEVEL_BADGE: Record<UserLevel, ComponentType<SVGProps<SVGSVGElement>>> = {
  superManager: SuperManagerBadge,
  executiveManager: ExecutiveBadge,
  manager: ManagerBadge,
  member: MemberBadge,
};
