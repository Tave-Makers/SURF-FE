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
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { ContentsType } from '@/shared/types/contents';
import { GroupManagementMode } from '@/widgets/group-management/model/types';
import { GroupInfoSection } from '@/widgets/group-management/ui/GroupInfoSection';
import { GroupMemberSection } from '@/widgets/group-management/ui/GroupMemberSection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { useMemberGenerationListQuery } from '@/widgets/member-directory/model/queries/useMemberGenerationListQuery';

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

  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  // 모든 기수 정보 조회
  const { data } = useMemberGenerationListQuery();
  const MAX_GENERATION = data.generations.length > 0 ? Math.max(...data.generations) : 0;

  const [generation, setGeneration] = useState<number>(MAX_GENERATION);
  const [groupType, setGroupType] = useState<ContentsType>('study');
  const [groupName, setGroupName] = useState('');
  const [groupIntroduction, setGroupIntroduction] = useState('');

  // TODO : API 연동 후 mockData 제거
  const { leader, members, pickLeader, removeMember } = useGroupMembersField({
    leader: mockLeader,
    members: mockMembers,
  });

  const openGenerationBottomSheet = () => {
    openBottomSheet({
      type: 'generation',
      props: {
        maxGeneration: MAX_GENERATION,
        selectedGeneration: generation,
        onSelect: (val) => {
          setGeneration(val);
          closeBottomSheet();
        },
      },
    });
  };

  const openGroupTypeBottomSheet = () => {
    openBottomSheet({
      type: 'groupType',
      props: {
        groupType: groupType,
        onSelect: (val) => {
          setGroupType(val);
          closeBottomSheet();
        },
      },
    });
  };

  const openPickLeaderBottomSheet = () => {
    openBottomSheet({
      type: 'pickLeader',
      props: {
        members: members,
        onSelect: (member) => {
          pickLeader(member);
          closeBottomSheet();
        },
      },
    });
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
