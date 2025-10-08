import ManagerBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import SuperManagerBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import ExecutiveBadge from '@/shared/assets/icons/profile/manager-badge.svg';
import MemberBadge from '@/shared/assets/icons/profile/manager-badge.svg';

export type UserLevel = 'superManager' | 'executiveManager' | 'manager' | 'member'; // 슈퍼매니저, 처장단, 운영진, 회원

export const USER_LEVEL_BADGE: Record<UserLevel, React.FC<React.SVGProps<SVGSVGElement>>> = {
  superManager: SuperManagerBadge,
  executiveManager: ExecutiveBadge,
  manager: ManagerBadge,
  member: MemberBadge,
};
