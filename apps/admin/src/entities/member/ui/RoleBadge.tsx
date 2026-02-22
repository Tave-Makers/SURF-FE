import { MemberRole } from '../model/types';
import { StatusBadge, StatusBadgeVariant } from '@/shared/ui/StatusBadge';

interface RoleBadgeProps {
  type: MemberRole;
}

const MEMBER_ROLE_MAP: Record<MemberRole, { label: string; variant: StatusBadgeVariant }> = {
  ADMIN: { label: 'Admin', variant: 'neutral' },
  PRESIDENT: { label: 'President', variant: 'pink' },
  MANAGER: { label: 'Manager', variant: 'green' },
  MEMBER: { label: 'Member', variant: 'purple' },
};

export const RoleBadge = ({ type }: RoleBadgeProps) => {
  const { label, variant } = MEMBER_ROLE_MAP[type];

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
};
