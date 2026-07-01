'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { Suspense, useEffect } from 'react';
import { MemberGenerationAccordionList } from './MemberGenerationAccordionList';
import { useApprovedMemberCountQuery } from '@/entities/member/model/queries/useMemberCountQuery';
import { useDismissMemberMutation } from '@/features/member/dismiss/model/useDismissMemberMutation';
import { useExpelMemberMutation } from '@/features/member/expel/model/useExpelMemberMutation';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';
import { ErrorBoundary } from '@/shared/ui/error/ErrorBoundary';
import { SelectableListTopBar } from '@/shared/ui/SelectableListTopBar';

interface MemberDirectoryWidgetProps {
  keyword: string;
}

export const MemberDirectoryWidget = ({ keyword }: MemberDirectoryWidgetProps) => {
  const { data: totalCount } = useApprovedMemberCountQuery(keyword); //승인된 전체 멤버수 조회

  const {
    mode,
    selectedIds,
    selectedCount,
    enterSelectMode,
    exitSelectMode,
    toggleSelect,
    resetSelectionState,
  } = useSelectableListState<number>();

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);
  const { mutate: dismissMembers, isPending: isDismissPending } = useDismissMemberMutation();
  const { mutate: expelMembers, isPending: isExpelPending } = useExpelMemberMutation();

  const selectedMemberIds = Array.from(selectedIds);
  const isPending = isDismissPending || isExpelPending;

  useEffect(() => {
    resetSelectionState();
  }, [keyword, resetSelectionState]);

  const handleDismissMembers = () => {
    if (isPending || selectedMemberIds.length === 0) return;

    dismissMembers(
      { memberIds: selectedMemberIds },
      {
        onSuccess: () => {
          showToast('선택한 멤버가 제명되었습니다.');
          resetSelectionState();
        },
        onError: (error) => {
          showToast(error.message);
        },
      },
    );
  };

  const handleExpelMembers = () => {
    if (isPending || selectedMemberIds.length === 0) return;

    expelMembers(
      { memberIds: selectedMemberIds },
      {
        onSuccess: () => {
          showToast('선택한 멤버가 퇴출되었습니다.');
          resetSelectionState();
        },
        onError: (error) => {
          showToast(error.message);
        },
      },
    );
  };

  const openDismissConfirm = () => {
    openAlert({
      state: 'default',
      title: '선택한 멤버를 제명하시겠습니까?',
      infoText: `제명 버튼을 누를 시 선택한 ${selectedCount}명의 멤버를 SURF에서 제명합니다.`,
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'danger',
          label: '제명하기',
          onClick: () => {
            closeAlert();
            handleDismissMembers();
          },
        },
      ],
    });
  };

  const openExpelConfirm = () => {
    openAlert({
      state: 'default',
      title: '선택한 멤버를 퇴출하시겠습니까?',
      infoText: `퇴출 버튼을 누를 시 선택한 ${selectedCount}명의 멤버를 SURF에서 퇴출합니다.`,
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'danger',
          label: '퇴출하기',
          onClick: () => {
            closeAlert();
            handleExpelMembers();
          },
        },
      ],
    });
  };

  const bottomActions = [
    {
      key: 'dismiss',
      label: '제명하기',
      disabled: selectedCount === 0 || isPending,
      onClick: openDismissConfirm,
    },
    {
      key: 'expel',
      label: '퇴출하기',
      disabled: selectedCount === 0 || isPending,
      onClick: openExpelConfirm,
    },
  ];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 멤버 디렉토리 상단 바 */}
      <SelectableListTopBar
        mode={mode}
        totalCount={totalCount ?? 0}
        selectedCount={selectedCount}
        onEnterSelectMode={enterSelectMode}
        onExitSelectMode={exitSelectMode}
      />

      {/* 기수별 멤버 목록 아코디언 리스트 */}
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4">loading...</div>}>
          <MemberGenerationAccordionList
            keyword={keyword}
            mode={mode}
            selectedIds={selectedIds}
            onToggleMember={toggleSelect}
          />
        </Suspense>
      </ErrorBoundary>
      {mode === 'select' && <BottomActionBar actions={bottomActions} />}
    </div>
  );
};
