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
  isCreateNavigating?: boolean; // 생성하기 버튼이 일시적으로 활성화되는 것을 막는 플래그
  isEditPending: boolean;
  onCreate: () => void;
  onEdit: () => void;
}): StickyButtonConfig => {
  const {
    mode,
    canSubmit,
    isCreatePending,
    isCreateNavigating = false,
    isEditPending,
    onCreate,
    onEdit,
  } = params;

  if (mode === 'view') return null;

  const isPending = mode === 'create' ? isCreatePending || isCreateNavigating : isEditPending;

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
