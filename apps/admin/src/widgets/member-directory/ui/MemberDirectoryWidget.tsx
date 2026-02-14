'use client';

import { useEffect } from 'react';

import { useMemberGenerationListQuery } from '../model/queries/useMemberGenerationListQuery';

import { MemberGenerationAccordionList } from './MemberGenerationAccordionList';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { SelectableListTopBar } from '@/shared/ui/SelectableListTopBar';

interface MemberDirectoryWidgetProps {
  keyword: string;
}
export const MemberDirectoryWidget = ({ keyword }: MemberDirectoryWidgetProps) => {
  const { data } = useMemberGenerationListQuery();

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
        totalCount={data.totalMemberCount}
        selectedCount={selectedCount}
        onEnterSelectMode={enterSelectMode}
        onExitSelectMode={exitSelectMode}
      />

      {/* 기수별 멤버 목록 아코디언 리스트 */}
      <MemberGenerationAccordionList generations={data.generations} />
    </div>
  );
};
