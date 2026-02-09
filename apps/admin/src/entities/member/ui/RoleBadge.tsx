import { StatusBadge } from '@/shared/ui/StatusBadge';

interface RoleBadgeProps {
  type: string;
}

const ROLE_MAP: Record<string, { label: string; variant: 'pink' | 'purple' | 'green' }> = {
  PRESIDENT: { label: 'President', variant: 'pink' },
  MANAGER: { label: 'Manager', variant: 'green' },
  MEMBER: { label: 'Member', variant: 'purple' },
};

const DEFAULT_ROLE = { label: 'Member', variant: 'purple' } as const;

export const RoleBadge = ({ type }: RoleBadgeProps) => {
  const { label, variant } = ROLE_MAP[type] ?? DEFAULT_ROLE;

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
};
