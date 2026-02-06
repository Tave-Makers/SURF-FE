'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { SignupRequestListContent } from './SignupRequestListContent';
import { useSignupRequestList } from '@/features/signup-request/model/queries/useSignupRequestList';
import {
  getSelectedStatuses,
  getSelectionPolicy,
} from '@/features/signup-request/model/selectionPolicy';
import { useSignupStatusActions } from '@/features/signup-request/model/useSignupStatusActions';
import { RequestListTopBar } from '@/features/signup-request/ui/RequestListTopBar';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

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
  const [mode, setMode] = useState<'view' | 'select'>('view');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filters = useMemo(() => (keyword ? { keyword } : {}), [keyword]);
  const { members, totalCount, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSignupRequestList(filters);

  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const handleReset = () => {
    setSelectedIds(new Set());
    setMode('view');
  };

  useEffect(() => {
    handleReset();
  }, [keyword]);

  const statuses = getSelectedStatuses(members, selectedIds);
  const { selectedCount, canApprove, canReject } = getSelectionPolicy(statuses);

  const { openApproveAlert, openRejectAlert, isPending } = useSignupStatusActions({
    memberIds: Array.from(selectedIds),
    onSuccess: handleReset,
  });

  const handleToggleSelect = (memberId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) {
        next.delete(memberId);
      } else {
        next.add(memberId);
      }
      return next;
    });
  };

  const handleOpenDetail = (memberId: number) => {
    openBottomSheet({
      type: 'signup',
      props: {
        memberId,
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
      <RequestListTopBar
        mode={mode}
        selectCount={selectedCount}
        totalCount={totalCount}
        onClickSelect={() => setMode('select')}
        onClickCancel={handleReset}
      />
      {/* 회원가입 요청 멤버 리스트*/}
      <ErrorBoundary fallback={<div>error</div>}>
        <Suspense fallback={<div>loading...</div>}>
          <SignupRequestListContent
            members={members}
            isSelectionEnabled={mode === 'select'}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onClickMore={handleOpenDetail}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={() => {
              void fetchNextPage();
            }}
          />
        </Suspense>
      </ErrorBoundary>
      {mode === 'select' && selectedCount > 0 && <BottomActionBar actions={bottomActions} />}
    </div>
  );
};
