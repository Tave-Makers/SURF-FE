import { useMemo } from 'react';
import { SignupRequestMember } from '@/entities/signup-request/model/types';
import {
  createMemberStatusMap,
  getSelectionPolicy,
} from '@/features/signup-request/model/selectionPolicy';
import { useSignupStatusActions } from '@/features/signup-request/model/useSignupStatusActions';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';

interface SignupRequestActionBarProps {
  members: SignupRequestMember[];
  selectedIds: Set<number>;
  mode: 'view' | 'select';
  resetSelectionState: () => void;
}

export const SignupRequestActionBar = ({
  members,
  selectedIds,
  mode,
  resetSelectionState,
}: SignupRequestActionBarProps) => {
  const memberStatusMap = useMemo(() => createMemberStatusMap(members), [members]);

  const { canApprove, canReject } = useMemo(
    () => getSelectionPolicy(memberStatusMap, selectedIds),
    [memberStatusMap, selectedIds],
  );

  const { openApproveAlert, openRejectAlert, isPending } = useSignupStatusActions({
    memberIds: Array.from(selectedIds),
    onSuccess: resetSelectionState,
  });

  const bottomActions = [
    {
      key: 'approve',
      label: '승인하기',
      onClick: openApproveAlert,
      disabled: !canApprove || isPending,
    },
    {
      key: 'reject',
      label: '거절하기',
      onClick: openRejectAlert,
      disabled: !canReject || isPending,
    },
  ];

  if (mode !== 'select' || selectedIds.size === 0) return null;

  return <BottomActionBar actions={bottomActions} />;
};
