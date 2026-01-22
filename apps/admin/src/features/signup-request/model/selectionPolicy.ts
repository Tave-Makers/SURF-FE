import { SignupRequestMember, SignupRequestStatus } from '@/entities/signup-request/model/types';

export type SelectionPolicy = {
  selectedCount: number;
  canApprove: boolean;
  canReject: boolean;
};

export function getSelectedStatuses(
  members: SignupRequestMember[],
  selectedIds: Set<number>,
): SignupRequestStatus[] {
  const statuses: SignupRequestStatus[] = [];

  for (const member of members) {
    if (selectedIds.has(member.id)) {
      statuses.push(member.status);
    }
  }

  return statuses;
}

export function getSelectionPolicy(statuses: SignupRequestStatus[]): SelectionPolicy {
  const selectedCount = statuses.length;
  const hasSelection = selectedCount > 0;
  const allWaiting = hasSelection && statuses.every((status) => status === 'waiting');

  return {
    selectedCount,
    canApprove: allWaiting,
    canReject: allWaiting,
  };
}
