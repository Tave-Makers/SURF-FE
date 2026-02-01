'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { SignupRequestListContent } from './SignupRequestListContent';
import { useSignupRequestList } from '@/features/signup-request/model/queries/useSignupRequestList';
import {
  getSelectedStatuses,
  getSelectionPolicy,
} from '@/features/signup-request/model/selectionPolicy';
import { useUpdateSignupRequestStatusMutation } from '@/features/signup-request/model/useUpdateRequestStatusMutation';
import { RequestListTopBar } from '@/features/signup-request/ui/RequestListTopBar';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { BottomActionBar } from '@/shared/ui/BottomActionBar';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';

interface SignupRequestListWidgetProps {
  keyword: string;
}

/**
 * 가입 신청 목록 위젯
 *
 * 가입 신청 목록과 관련된 UI 요소들을 조합합니다.
 * - 상단 바 (전체 멤버 수, 선택 모드) - 항상 표시
 * - 가입 신청 목록 (스크롤 가능) - Suspense로 로딩 처리
 *
 */
export const SignupRequestListWidget = ({ keyword }: SignupRequestListWidgetProps) => {
  const [mode, setMode] = useState<'view' | 'select'>('view');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const filters = useMemo(() => (keyword ? { keyword } : {}), [keyword]);
  const { members, totalCount, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSignupRequestList(filters);

  const showErrorToast = useToastStore((s) => s.show);
  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const { mutate, isPending } = useUpdateSignupRequestStatusMutation();

  useEffect(() => {
    setMode('view');
    setSelectedIds(new Set());
  }, [keyword]);

  const statuses = getSelectedStatuses(members, selectedIds);
  const { selectedCount, canApprove, canReject } = getSelectionPolicy(statuses);

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

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

  const handleApprove = useCallback(() => {
    if (!canApprove || selectedIds.size === 0) {
      return;
    }

    mutate(
      {
        memberIds: Array.from(selectedIds),
        nextStatus: 'approve',
        filters,
      },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
        onError: (error) => {
          showErrorToast(error.message);
        },
      },
    );
  }, [canApprove, filters, mutate, selectedIds, showErrorToast]);

  const handleReject = useCallback(() => {
    if (!canReject || selectedIds.size === 0) {
      return;
    }

    mutate(
      {
        memberIds: Array.from(selectedIds),
        nextStatus: 'reject',
        filters,
      },
      {
        onSuccess: () => {
          setSelectedIds(new Set());
        },
        onError: (error) => {
          showErrorToast(error.message);
        },
      },
    );
  }, [canReject, filters, mutate, selectedIds, showErrorToast]);

  const openApproveAlert = useCallback(() => {
    openAlert({
      state: 'default',
      title: '회원 가입을 승인하시겠습니까?',
      infoText: `승인 버튼을 누를 시, 선택한 ${selectedCount}명의 인원의 회원가입을 승인합니다.`,
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => {
            closeAlert();
          },
        },
        {
          type: 'solid',
          variant: 'primary',
          label: '승인하기',
          onClick: () => {
            closeAlert();
            handleApprove();
          },
        },
      ],
    });
  }, [closeAlert, handleApprove, openAlert, selectedCount]);

  const openRejectAlert = useCallback(() => {
    openAlert({
      state: 'default',
      title: '회원 가입을 거절하시겠습니까?',
      infoText: `거절 버튼을 누를 시, 해당 인원의 회원가입이 거절됩니다.`,
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => {
            closeAlert();
          },
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '거절하기',
          onClick: () => {
            closeAlert();
            handleReject();
          },
        },
      ],
    });
  }, [closeAlert, handleReject, openAlert]);

  const handleOpenDetail = useCallback(
    (_memberId: number) => {
      openBottomSheet({
        type: 'signup',
        props: {
          status: 'waiting',
        },
      });
    },
    [openBottomSheet],
  );

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
        onClickCancel={() => {
          setMode('view');
          setSelectedIds(new Set());
        }}
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
