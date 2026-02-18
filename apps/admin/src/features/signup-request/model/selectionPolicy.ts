import { MemberStatus } from '@/entities/member/model/types';
import { SignupRequestMember } from '@/entities/signup-request/model/types';

export type SelectionPolicy = {
  selectedCount: number;
  canApprove: boolean;
  canReject: boolean;
};

export function getSelectedStatuses(
  members: SignupRequestMember[],
  selectedIds: Set<number>,
): MemberStatus[] {
  const statuses: MemberStatus[] = [];

  for (const member of members) {
    if (selectedIds.has(member.id)) {
      statuses.push(member.status);
    }
  }

  return statuses;
}

export function getSelectionPolicy(statuses: MemberStatus[]): SelectionPolicy {
  const selectedCount = statuses.length;
  const hasSelection = selectedCount > 0;
  const allWaiting = hasSelection && statuses.every((status) => status === 'waiting');

  return {
    selectedCount,
    canApprove: allWaiting,
    canReject: allWaiting,
  };
}
