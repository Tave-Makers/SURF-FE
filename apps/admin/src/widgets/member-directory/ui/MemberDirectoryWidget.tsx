'use client';

import { useEffect } from 'react';
import { MemberGenerationAccordian } from './MemberGenerationAccordian';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { SelectableListTopBar } from '@/shared/ui/SelectableListTopBar';

interface MemberDirectoryWidgetProps {
  keyword: string;
}
export const MemberDirectoryWidget = ({ keyword }: MemberDirectoryWidgetProps) => {
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
        totalCount={0}
        selectedCount={selectedCount}
        onEnterSelectMode={enterSelectMode}
        onExitSelectMode={exitSelectMode}
      />
      {/* 멤버 아코디언 리스트 */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <MemberGenerationAccordian generation={12} />
      </div>
    </div>
  );
};
