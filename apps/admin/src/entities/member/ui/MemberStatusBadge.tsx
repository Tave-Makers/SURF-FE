import { MemberStatus } from '@/entities/member/model/types';
import { StatusBadge } from '@/shared/ui/StatusBadge';

interface MemberStatusBadgeProps {
  status: MemberStatus;
}

const map = {
  reject: { label: '거절', variant: 'pink' },
  waiting: { label: '대기', variant: 'purple' },
  approve: { label: '승인', variant: 'green' },
} as const;

export const MemberStatusBadge = ({ status }: MemberStatusBadgeProps) => {
  const { label, variant } = map[status];

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
};
