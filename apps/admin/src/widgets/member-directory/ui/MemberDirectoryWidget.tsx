'use client';

import { Suspense, useEffect } from 'react';
import { MemberGenerationAccordionList } from './MemberGenerationAccordionList';
import { useApprovedMemberCountQuery } from '@/entities/member/model/queries/useMemberCountQuery';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { ErrorBoundary } from '@/shared/ui/error/ErrorBoundary';
import { SelectableListTopBar } from '@/shared/ui/SelectableListTopBar';

interface MemberDirectoryWidgetProps {
  keyword: string;
}

export const MemberDirectoryWidget = ({ keyword }: MemberDirectoryWidgetProps) => {
  const { data: totalCount } = useApprovedMemberCountQuery(keyword); //승인된 전체 멤버수 조회

  const { mode, selectedCount, enterSelectMode, exitSelectMode, resetSelectionState } =
    useSelectableListState<number>();

  useEffect(() => {
    resetSelectionState();
  }, [keyword, resetSelectionState]);

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
          <MemberGenerationAccordionList keyword={keyword} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};
