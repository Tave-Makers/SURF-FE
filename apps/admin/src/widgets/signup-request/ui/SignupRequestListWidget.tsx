'use client';

import { useEffect, useMemo } from 'react';
import { SignupRequestListContent } from './SignupRequestListContent';
import { useSignupRequestList } from '@/features/signup-request/model/queries/useSignupRequestList';
import {
  getSelectedStatuses,
  getSelectionPolicy,
} from '@/features/signup-request/model/selectionPolicy';
import { useSignupStatusActions } from '@/features/signup-request/model/useSignupStatusActions';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';
import { SelectableListTopBar } from '@/shared/ui/SelectableListTopBar';

interface SignupRequestListWidgetProps {
  keyword: string;
}

/**
 * 가입 신청 목록 위젯
 * @description 가입 신청 목록과 관련된 UI 요소들을 조합합니다.
 * - 상단 바 (전체 멤버 수, 선택 모드) - 항상 표시
 * - 가입 신청 목록 (스크롤 가능) - Suspense로 로딩 처리
 */
export const SignupRequestListWidget = ({ keyword }: SignupRequestListWidgetProps) => {
  const {
    mode,
    selectedIds,
    selectedCount,
    enterSelectMode,
    exitSelectMode,
    toggleSelect,
    resetSelectionState,
  } = useSelectableListState<number>();

  const filters = useMemo(() => (keyword ? { keyword } : {}), [keyword]);
  const { members, totalCount, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSignupRequestList(filters);

  const openBottomSheet = useBottomSheetStore((s) => s.open);

  useEffect(() => {
    resetSelectionState();
  }, [keyword, resetSelectionState]);

  const statuses = getSelectedStatuses(members, selectedIds);
  const { canApprove, canReject } = getSelectionPolicy(statuses);

  //회원가입 상태 처리 액션 훅
  const { openApproveAlert, openRejectAlert, isPending } = useSignupStatusActions({
    memberIds: Array.from(selectedIds),
    onSuccess: resetSelectionState,
  });

  //상세 바텀시트 오픈 핸들러
  const handleOpenDetail = (memberId: number) => {
    openBottomSheet({
      type: 'signup',
      props: {
        memberId,
        showAction: mode === 'view',
      },
    });
  };

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

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 회원가입 요청 상단 바 */}
      <SelectableListTopBar
        mode={mode}
        totalCount={totalCount}
        selectedCount={selectedCount}
        onEnterSelectMode={enterSelectMode}
        onExitSelectMode={exitSelectMode}
      />
      {/* 회원가입 요청 멤버 리스트*/}
      <SignupRequestListContent
        members={members}
        isSelectionEnabled={mode === 'select'}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onClickMore={handleOpenDetail}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => {
          void fetchNextPage();
        }}
      />
      {mode === 'select' && selectedCount > 0 && <BottomActionBar actions={bottomActions} />}
    </div>
  );
};
