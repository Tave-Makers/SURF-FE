import { SignupRequestStatus } from '../model/types';
import { StatusBadge } from '@/shared/ui/StatusBadge';

interface RequestStatusBadgeProps {
  status: SignupRequestStatus;
}

const map = {
  reject: { label: '거절', variant: 'pink' },
  waiting: { label: '대기', variant: 'purple' },
  approve: { label: '승인', variant: 'green' },
} as const;

export const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  const { label, variant } = map[status];

  return <StatusBadge variant={variant}>{label}</StatusBadge>;
};
