import type { GroupManagementMode } from '@/widgets/group-management/model/types';

export type StickyButtonConfig = null | {
  label: string;
  disabled: boolean;
  onClick: () => void;
};

export const getStickyButtonConfig = (params: {
  mode: GroupManagementMode;
  canSubmit: boolean;
  isCreatePending: boolean;
  isEditPending: boolean;
  onCreate: () => void;
  onEdit: () => void;
}): StickyButtonConfig => {
  const { mode, canSubmit, isCreatePending, isEditPending, onCreate, onEdit } = params;

  if (mode === 'view') return null;

  const isPending = mode === 'create' ? isCreatePending : isEditPending;

  return {
    label: isPending
      ? mode === 'create'
        ? '생성 중...'
        : '수정 중...'
      : mode === 'create'
        ? '생성하기'
        : '수정하기',
    disabled: !canSubmit || isPending,
    onClick: mode === 'create' ? onCreate : onEdit,
  };
};
