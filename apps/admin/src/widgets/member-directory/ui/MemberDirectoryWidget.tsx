'use client';

import { Avatar } from '@surf/ui/avatar';
import { useEffect } from 'react';

import { RoleBadge } from '@/entities/member/ui/RoleBadge';
import { SelectableMemberCard } from '@/entities/member/ui/SelectableMemberCard';
import { MemberGenerationAccordion } from '@/features/member-by-generation/ui/MemberGenerationAccordion';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { SelectableListTopBar } from '@/shared/ui/SelectableListTopBar';

interface MemberDirectoryWidgetProps {
  keyword: string;
}
export const MemberDirectoryWidget = ({ keyword }: MemberDirectoryWidgetProps) => {
  const { mode, selectedCount, enterSelectMode, exitSelectMode, resetSelectionState } =
    useSelectableListState<number>();
  const openBottomSheet = useBottomSheetStore((s) => s.open);

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
            <SelectableMemberCard
              name={m.name}
              tracks={m.tracks}
              checked={false}
              onToggle={() => {}}
              leftSlot={<Avatar size="s" alt="테이비 프로필 이미지" src={m.profileImageUrl} />}
              rightSlot={<RoleBadge type={m.role} />}
            />
          )}
        />
      </div>
      <button
        onClick={() =>
          openBottomSheet({
            type: 'member',
            props: {
              memberId: 1,
            },
          })
        }
      >
        멤버 바텀시트 트리거
      </button>
    </div>
  );
};
