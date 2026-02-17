'use client';

import { SolidButton } from '@surf/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import {
  mapModeToStickyButton,
  mapModeToHeaderProps,
} from '@/app-pages/group-management/model/mapper';
import { mockLeader, mockMembers } from '@/app-pages/group-management/model/mock';
import { useGroupMembersField } from '@/features/group-management/model/useGroupMembersField';
import { ContentsType } from '@/shared/types/contents';
import { GroupManagementMode } from '@/widgets/group-management/model/types';
import { GroupInfoSection } from '@/widgets/group-management/ui/GroupInfoSection';
import { GroupMemberSection } from '@/widgets/group-management/ui/GroupMemberSection';
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

  const [generation, _setGeneration] = useState<number>(17); // TODO: 가장 최근 기수 API로 초기값 설정
  const [groupType, _setGroupType] = useState<ContentsType>('study');
  const [groupName, setGroupName] = useState('');
  const [groupIntroduction, setGroupIntroduction] = useState('');

  // TODO : API 연동 후 mockData 제거
  const { leader, members, removeMember } = useGroupMembersField({
    leader: mockLeader,
    members: mockMembers,
  });

  const openGenerationBottomSheet = () => {
    // 기수 선택 바텀시트 오픈
  };

  const openGroupTypeBottomSheet = () => {
    // 그룹 유형 선택 바텀시트 오픈
  };

  const openPickLeaderBottomSheet = () => {
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
      <div className="scrollbar-hide flex flex-1 flex-col gap-14 overflow-y-auto">
        <GroupInfoSection
          mode={mode}
          generation={generation}
          groupType={groupType}
          groupName={groupName}
          groupIntroduction={groupIntroduction}
          onOpenGeneration={openGenerationBottomSheet}
          onOpenGroupType={openGroupTypeBottomSheet}
          onChangeGroupName={setGroupName}
          onChangeGroupIntroduction={setGroupIntroduction}
        />
        <GroupMemberSection
          mode={mode}
          teamLeader={leader}
          teamMembers={members}
          onPickLeader={openPickLeaderBottomSheet}
          onAddMembers={handleAddMembers}
          onRemoveMember={handleRemoveMember}
        />
        {mode === 'edit' && (
          <div className="px-13 py-15">
            <SolidButton size="m" variant="warning" onClick={() => {}} className="shrink-0">
              해당 그룹 삭제하기
            </SolidButton>
          </div>
        )}
      </div>
      <div className="px-13 py-16 pt-13">{mapModeToStickyButton(mode)}</div>
    </div>
  );
};
