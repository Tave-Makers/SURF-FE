import { MemberStatus } from '@/entities/member/model/types';
import { SignupRequestMember } from '@/entities/signup-request/model/types';

export type SelectionPolicy = {
  canApprove: boolean;
  canReject: boolean;
};

export function createMemberStatusMap(
  members: SignupRequestMember[],
): ReadonlyMap<number, MemberStatus> {
  return new Map(members.map((member) => [member.id, member.status]));
}

export function getSelectionPolicy(
  memberStatusMap: ReadonlyMap<number, MemberStatus>,
  selectedIds: Set<number>,
): SelectionPolicy {
  if (selectedIds.size === 0) {
    return {
      canApprove: false,
      canReject: false,
    };
  }

  for (const selectedId of selectedIds) {
    const status = memberStatusMap.get(selectedId);
    if (status !== 'waiting') {
      return {
        canApprove: false,
        canReject: false,
      };
    }
  }

  return {
    canApprove: true,
    canReject: true,
  };
}
