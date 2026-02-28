'use client';

import { SolidButton } from '@surf/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

import { useGroupManagementDetailController } from '@/app-pages/group-management/model/useGroupManagementDetailController';

import type { GroupManagementMode } from '@/widgets/group-management/model/types';
import { GroupInfoSection } from '@/widgets/group-management/ui/GroupInfoSection';
import { GroupMemberSection } from '@/widgets/group-management/ui/GroupMemberSection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

interface Props {
  mode: GroupManagementMode;
  id?: string;
}

export const GroupManagementDetailPage = ({ mode, id }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const c = useGroupManagementDetailController({ mode, id, router, searchParams });

  if (!c.draft) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader overrideHeader={c.header} />
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader overrideHeader={c.header} customBack={c.dirty ? c.openGoBackAlert : undefined} />

      <div className="scrollbar-hide flex flex-1 flex-col gap-14 overflow-y-auto">
        <GroupInfoSection
          mode={mode}
          generation={c.draft.generation}
          groupType={c.draft.groupType}
          groupName={c.draft.groupName}
          groupIntroduction={c.draft.groupIntroduction}
          onOpenGeneration={c.openGenerationBottomSheet}
          onOpenGroupType={c.openGroupTypeBottomSheet}
          onChangeGroupName={c.setGroupName}
          onChangeGroupIntroduction={c.setGroupIntroduction}
        />

        <GroupMemberSection
          mode={mode}
          teamLeader={c.draft.leader}
          teamMembers={c.draft.members}
          onPickLeader={
            c.draft.members.length === 0 ? c.openPickLeaderAlert : c.openPickLeaderBottomSheet
          }
          onAddMembers={c.handleAddMembers}
          onRemoveMember={c.removeMember}
        />

        {mode === 'edit' && (
          <div className="px-13 py-15">
            <SolidButton size="m" variant="warning" onClick={c.openDeleteAlert}>
              해당 그룹 삭제하기
            </SolidButton>
          </div>
        )}
      </div>

      <div className="px-13 py-16 pt-13">
        {c.sticky && (
          <SolidButton
            size="l"
            variant="primary"
            isDisabled={c.sticky.disabled}
            onClick={c.sticky.onClick}
          >
            {c.sticky.label}
          </SolidButton>
        )}
      </div>
    </div>
  );
};
