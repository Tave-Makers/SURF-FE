'use client';

import { Avatar } from '@surf/ui/avatar';
import { useEffect } from 'react';

import { MemberCard } from '@/entities/member/ui/MemberCard';
import { RoleBadge } from '@/entities/member/ui/RoleBadge';
import { MemberGenerationAccordion } from '@/features/member-by-generation/ui/MemberGenerationAccordion';
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
        <MemberGenerationAccordion
          generation={12}
          renderItem={(m) => (
            <MemberCard
              checked={false}
              name={m.name}
              tracks={m.tracks}
              isSelectionEnabled
              onToggle={() => {}}
              leftAddon={<Avatar size="s" alt="테이비 프로필 이미지" src={m.profileImageUrl} />}
              rightSlot={<RoleBadge type={m.role} />}
            />
          )}
        />
      </div>
    </div>
  );
};
