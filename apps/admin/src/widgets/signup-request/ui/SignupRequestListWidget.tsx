'use client';

import { Suspense, useEffect } from 'react';
import { SignupRequestListContainer } from './SignupRequestListContainer';
import { useSignupRequestCountQuery } from '@/entities/member/model/queries/useMemberCountQuery';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { ErrorBoundary } from '@/shared/ui/error/ErrorBoundary';
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

  const { data: totalCount } = useSignupRequestCountQuery(keyword);

  useEffect(() => {
    resetSelectionState();
  }, [keyword, resetSelectionState]);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* 회원가입 요청 상단 바 */}
      <SelectableListTopBar
        mode={mode}
        totalCount={totalCount ?? 0}
        selectedCount={selectedCount}
        onEnterSelectMode={enterSelectMode}
        onExitSelectMode={exitSelectMode}
      />
      {/* 회원가입 목록 */}
      <ErrorBoundary>
        <Suspense fallback={<div className="p-4">loading...</div>}>
          <SignupRequestListContainer
            keyword={keyword}
            mode={mode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            resetSelectionState={resetSelectionState}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
