'use client';

import { SolidButton } from '@surf/ui/button';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import {
  mapModeToHeaderProps,
  mapModeToStickyButton,
} from '@/app-pages/group-management/model/mapper';
import { MemberSummary } from '@/entities/member/model/types';
import { useCreateGroupMutatioin } from '@/features/group-management/model/queries/useCreateGroupMutation';
import { useGroupDetailQuery } from '@/features/group-management/model/queries/useGroupDetailQuery';
import { useGroupFormStore } from '@/features/group-management/model/useGroupFormStore';
import { PAGE_ROUTES } from '@/shared/config/path';
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

  // hooks
  const { data } = useMemberGenerationListQuery(); // 모든 기수 정보 조회
  const maxGeneration = useMemo(() => {
    const gens = data?.generations ?? [];
    return gens.length > 0 ? Math.max(...gens) : 0;
  }, [data]); // 최대 기수 계산

  const { data: groupDetail } = useGroupDetailQuery(mode, Number(id)); // 'view', 'edit' 모드일 때 그룹 상세 조회
  const { mutateAsync: createGroup } = useCreateGroupMutatioin(); // 'create' 모드일 때 그룹 생성

  // store selectors
  const formKey = mode === 'create' ? 'create' : String(id);

  const hasForm = useGroupFormStore((s) => s.forms[formKey] != null);
  const draft = useGroupFormStore((s) => s.forms[formKey]?.draft);
  const hydrate = useGroupFormStore((s) => s.hydrate);

  const setGeneration = useGroupFormStore((s) => s.setGeneration);
  const setGroupType = useGroupFormStore((s) => s.setGroupType);
  const setGroupName = useGroupFormStore((s) => s.setGroupName);
  const setGroupIntroduction = useGroupFormStore((s) => s.setGroupIntroduction);

  const pickLeader = useGroupFormStore((s) => s.pickLeader);
  const removeMember = useGroupFormStore((s) => s.removeMember);

  const isValid = useGroupFormStore((s) => s.isValid(formKey));
  const dirty = useGroupFormStore((s) => s.forms[formKey]?.dirty ?? false);
  const canSubmit = dirty && isValid;

  // 초기 hydrate (폼이 없을 때만)
  useEffect(() => {
    hydrate(formKey, {
      generation: groupDetail?.generation ?? maxGeneration,
      groupType: groupDetail?.groupType ?? ('study' as ContentsType),
      groupName: groupDetail?.groupName ?? '',
      groupIntroduction: groupDetail?.groupIntroduction ?? '',
      leader: groupDetail?.leader,
      members: groupDetail?.members ?? [],
    });
  }, [hasForm, hydrate, formKey, maxGeneration, groupDetail]);

  // draft가 아직 없으면(초기 hydrate 전) 안전 가드
  if (!draft) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader overrideHeader={headerProps} />
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      </div>
    );
  }

  // bottom sheets
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
        onSelect: (member: MemberSummary) => {
          pickLeader(formKey, member);
          closeBottomSheet();
        },
      },
    });
  };

  // handlers
  const handleAddMembers = () => {
    const params = new URLSearchParams();
    params.set('generation', String(draft.generation));
    params.set('formKey', formKey);

    router.push(`${PAGE_ROUTES.GROUP_MNG.MEMBER_SEARCH}?${params.toString()}`);
  };

  const handleRemoveMember = (memberId: number) => {
    removeMember(formKey, memberId);
  };

  const handleSubmit = async () => {
    if (mode === 'create') {
      if (!draft) return;
      const created = await createGroup(draft);
      const groupId = created.teamId;
      router.push(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
    } else if (mode === 'edit') {
      // 수정 API 호출 로직 (formKey + draft)
      alert('그룹 수정 API 연동 예정');
    }
  };

  const handleDeleteGroup = () => {
    alert('그룹 삭제 확인 Alert 구현 예정');
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
            <SolidButton size="m" variant="warning" onClick={handleDeleteGroup}>
              해당 그룹 삭제하기
            </SolidButton>
          </div>
        )}
      </div>

      <div className="px-13 py-16 pt-13">
        {mapModeToStickyButton({
          mode: mode,
          onClick: () => void handleSubmit(),
          isDisabled: !canSubmit,
        })}
      </div>
    </div>
  );
};
