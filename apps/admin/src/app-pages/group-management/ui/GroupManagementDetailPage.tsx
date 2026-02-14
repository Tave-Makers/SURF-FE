'use client';

import { SolidButton } from '@surf/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  mapModeToStickyButton,
  mapModeToHeaderProps,
} from '@/app-pages/group-management/model/mapper';
import { mockLeader, mockMembers } from '@/app-pages/group-management/model/mock';
import { useGroupMembersField } from '@/features/group-management/model/useGroupMembersField';
import {
  GroupManagementMode,
  GroupMemberSection,
} from '@/widgets/group-management/ui/GroupMemberSection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

interface GroupManagementDetailPageProps {
  mode: GroupManagementMode;
}

export const GroupManagementDetailPage = ({ mode }: GroupManagementDetailPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSwitchToEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', 'edit');
    router.push(`?${params.toString()}`);
  };
  const headerProps = mapModeToHeaderProps({ mode, onClickEdit: handleSwitchToEdit });

  const { leader, members, removeMember } = useGroupMembersField({
    leader: mockLeader,
    members: mockMembers,
  });

  const handlePickLeader = () => {
    // 오픈 바텀 시트
    // 선택 완료 시 pickLeader 호출
  };

  const handleAddMembers = () => {
    // 페이지 이동
    // 선택 완료 시 addMembers 호출 또는 쿼리 파라미터로 데이터 전달
  };

  const handleRemoveMember = (memberId: number) => {
    removeMember(memberId);
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader overrideHeader={headerProps} />
      <div className="flex flex-1 flex-col gap-20 overflow-y-auto">
        <GroupMemberSection
          mode={mode}
          teamLeader={leader}
          teamMembers={members}
          onPickLeader={handlePickLeader}
          onAddMembers={handleAddMembers}
          onRemoveMember={handleRemoveMember}
        />
        {mode === 'edit' && (
          <SolidButton size="m" variant="warning" onClick={() => {}} className="shrink-0">
            해당 그룹 삭제하기
          </SolidButton>
        )}
      </div>
      <div className="sticky bottom-0 px-13 py-16 pt-13">{mapModeToStickyButton(mode)}</div>
    </div>
  );
};
