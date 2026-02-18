'use client';

import { SolidButton } from '@surf/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import {
  mapModeToHeaderProps,
  mapModeToStickyButton,
} from '@/app-pages/group-management/model/mapper';
import { mockLeader, mockMembers } from '@/app-pages/group-management/model/mock';
import { MemberBase } from '@/entities/member/model/types';
import { useGroupFormStore } from '@/features/group-management/model/useGroupFormStore';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import type { ContentsType } from '@/shared/types/contents';
import { GroupManagementMode } from '@/widgets/group-management/model/types';
import { GroupInfoSection } from '@/widgets/group-management/ui/GroupInfoSection';
import { GroupMemberSection } from '@/widgets/group-management/ui/GroupMemberSection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { useMemberGenerationListQuery } from '@/widgets/member-directory/model/queries/useMemberGenerationListQuery';

interface GroupManagementDetailPageProps {
  mode: GroupManagementMode;
  id?: string;
}

export const GroupManagementDetailPage = ({ mode, id }: GroupManagementDetailPageProps) => {
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
  const maxGeneration = useMemo(() => {
    const gens = data?.generations ?? [];
    return gens.length > 0 ? Math.max(...gens) : 0;
  }, [data]);

  const formKey = mode === 'create' ? 'create' : String(id);

  // store selectors
  const hasForm = useGroupFormStore((s) => s.forms[formKey] != null);

  const draft = useGroupFormStore((s) => s.forms[formKey]?.draft);

  const hydrate = useGroupFormStore((s) => s.hydrate);

  const setGeneration = useGroupFormStore((s) => s.setGeneration);
  const setGroupType = useGroupFormStore((s) => s.setGroupType);
  const setGroupName = useGroupFormStore((s) => s.setGroupName);
  const setGroupIntroduction = useGroupFormStore((s) => s.setGroupIntroduction);

  const pickLeader = useGroupFormStore((s) => s.pickLeader);
  // const addMembers = useGroupFormStore((s) => s.addMembers);
  const removeMember = useGroupFormStore((s) => s.removeMember);

  // 초기 hydrate (폼이 없을 때만)
  useEffect(() => {
    if (hasForm) return;

    // TODO: API 연동 후 mockData 제거
    hydrate(formKey, {
      generation: maxGeneration,
      groupType: 'study' as ContentsType,
      groupName: '',
      groupIntroduction: '',
      leader: mockLeader,
      members: mockMembers,
    });
  }, [hasForm, hydrate, formKey, maxGeneration]);

  // draft가 아직 없으면(초기 hydrate 전) 안전 가드
  if (!draft) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader overrideHeader={headerProps} />
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      </div>
    );
  }

  const openGenerationBottomSheet = () => {
    openBottomSheet({
      type: 'generation',
      props: {
        maxGeneration,
        selectedGeneration: draft.generation,
        onSelect: (val: number) => {
          setGeneration(formKey, val);
          closeBottomSheet();
        },
      },
    });
  };

  const openGroupTypeBottomSheet = () => {
    openBottomSheet({
      type: 'groupType',
      props: {
        groupType: draft.groupType,
        onSelect: (val: ContentsType) => {
          setGroupType(formKey, val);
          closeBottomSheet();
        },
      },
    });
  };

  const openPickLeaderBottomSheet = () => {
    openBottomSheet({
      type: 'pickLeader',
      props: {
        members: draft.members,
        onSelect: (member: MemberBase) => {
          // member 타입은 실제 bottomSheet props 타입에 맞춰서 교체
          pickLeader(formKey, member);
          closeBottomSheet();
        },
      },
    });
  };

  const handleAddMembers = () => {
    const params = new URLSearchParams();
    params.set('generation', String(draft.generation));
    params.set('formKey', formKey);

    router.push(`/group-management/member-search?${params.toString()}`);
  };

  const handleRemoveMember = (memberId: number) => {
    removeMember(formKey, memberId);
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader overrideHeader={headerProps} />

      <div className="scrollbar-hide flex flex-1 flex-col gap-14 overflow-y-auto">
        <GroupInfoSection
          mode={mode}
          generation={draft.generation}
          groupType={draft.groupType}
          groupName={draft.groupName}
          groupIntroduction={draft.groupIntroduction}
          onOpenGeneration={openGenerationBottomSheet}
          onOpenGroupType={openGroupTypeBottomSheet}
          onChangeGroupName={(v) => setGroupName(formKey, v)}
          onChangeGroupIntroduction={(v) => setGroupIntroduction(formKey, v)}
        />

        <GroupMemberSection
          mode={mode}
          teamLeader={draft.leader}
          teamMembers={draft.members}
          onPickLeader={openPickLeaderBottomSheet}
          onAddMembers={handleAddMembers}
          onRemoveMember={handleRemoveMember}
        />

        {mode === 'edit' && (
          <div className="px-13 py-15">
            <SolidButton size="m" variant="warning" onClick={() => {}}>
              해당 그룹 삭제하기
            </SolidButton>
          </div>
        )}
      </div>

      <div className="px-13 py-16 pt-13">{mapModeToStickyButton(mode)}</div>
    </div>
  );
};
