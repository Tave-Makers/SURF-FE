'use client';

import { SolidButton } from '@surf/ui/button';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { getHeaderConfig } from '@/app-pages/group-management/model/getHeaderConfig';
import { getStickyButtonConfig } from '@/app-pages/group-management/model/getStickyButtonConfig';
import { useGroupManagementAlerts } from '@/app-pages/group-management/model/useGroupManagementAlerts';
import { MemberSummary } from '@/entities/member/model/types';
import { useCreateGroupMutation } from '@/features/group-management/model/queries/useCreateGroupMutation';
import { useDeleteGroupMutation } from '@/features/group-management/model/queries/useDeleteGroupMutation';
import { useGroupDetailQuery } from '@/features/group-management/model/queries/useGroupDetailQuery';
import { useUpdateGroupMutation } from '@/features/group-management/model/queries/useUpdateGroupMutation';
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

  // stores
  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);

  const showToast = useToastStore((s) => s.show);

  // hooks
  const { data: generations, isLoading: isGenerationLoading } = useMemberGenerationListQuery(); // 모든 기수 정보 조회
  const MAX_GENERATION = useMemo(() => {
    const gens = generations ?? [];
    return gens.length > 0 ? Math.max(...gens) : 0;
  }, [generations]); // 최대 기수 계산

  const groupId = id ? Number(id) : undefined;
  const { data: groupDetail } = useGroupDetailQuery(groupId); // 'view', 'edit' 모드 그룹 상세 조회
  const { mutateAsync: createGroup, isPending: isCreatePending } = useCreateGroupMutation(); // 'create' 모드 그룹 생성
  const { mutateAsync: updateGroup, isPending: isEditPending } = useUpdateGroupMutation(groupId); // 'edit' 모드 그룹 수정
  const { mutateAsync: deleteGroup } = useDeleteGroupMutation(groupId); // 'edit' 모드 그룹 삭제

  // alerts handler
  const handleLeavePage = () => {
    removeForm(formKey);
    if (mode === 'edit' && groupId) router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
    else router.back();
  };

  const handleDeleteGroup = async () => {
    if (mode !== 'edit') return;
    await deleteGroup();
    showToast('그룹이 삭제되었습니다.');
    router.back();
  };

  const handleSubmitEdit = () => {
    void handleSubmit();
  };

  const { openSaveEditAlert, openDeleteAlert, openGoBackAlert, openPickLeaderAlert } =
    useGroupManagementAlerts({
      onSubmitEdit: handleSubmitEdit,
      onDeleteGroup: () => void handleDeleteGroup(),
      onLeavePage: handleLeavePage,
    });

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
  const removeForm = useGroupFormStore((s) => s.removeForm);

  const isValid = useGroupFormStore((s) => s.isValid(formKey));
  const dirty = useGroupFormStore((s) => s.forms[formKey]?.dirty ?? false);
  const canSubmit = dirty && isValid;

  // 초기 hydrate (폼이 없을 때만)
  useEffect(() => {
    hydrate(formKey, {
      generation: groupDetail?.generation ?? MAX_GENERATION,
      groupType: groupDetail?.groupType ?? ('study' as ContentsType),
      groupName: groupDetail?.groupName ?? '',
      groupIntroduction: groupDetail?.groupIntroduction ?? '',
      leader: groupDetail?.leader,
      members: groupDetail?.members ?? [],
    });
  }, [hasForm, mode, isGenerationLoading, hydrate, formKey, MAX_GENERATION, groupDetail]);

  // header '수정' 버튼 클릭 시 'edit' 모드로 변경
  const handleSwitchToEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', 'edit');
    router.replace(`?${params.toString()}`);
  };

  // header config
  const headerConfig = getHeaderConfig({
    mode,
    onClickEdit: handleSwitchToEdit,
  });

  // draft가 아직 없으면(초기 hydrate 전) 안전 가드
  if (!draft) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader overrideHeader={headerConfig} />
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      </div>
    );
  }

  // bottom sheets
  const openGenerationBottomSheet = () => {
    openBottomSheet({
      type: 'generation',
      props: {
        maxGeneration: MAX_GENERATION,
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

  const isSubmitPending = mode === 'create' ? isCreatePending : isEditPending;

  const handleSubmit = async () => {
    if (isSubmitPending) return;

    if (mode === 'create') {
      if (!draft) return;

      const created = await createGroup(draft);
      const groupId = created.teamId;

      router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
    } else if (mode === 'edit') {
      if (!groupId) return;

      await updateGroup(draft);
      router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
    }
  };

  // bottom stickyButton policy load
  const sticky = getStickyButtonConfig({
    mode,
    canSubmit,
    isCreatePending,
    isEditPending,
    onCreate: () => void handleSubmit(),
    onEdit: openSaveEditAlert,
  });

  return (
    <div className="flex h-full flex-col">
      <AppHeader overrideHeader={headerConfig} customBack={dirty ? openGoBackAlert : undefined} />

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
          onPickLeader={
            draft.members.length === 0 ? openPickLeaderAlert : openPickLeaderBottomSheet
          }
          onAddMembers={handleAddMembers}
          onRemoveMember={handleRemoveMember}
        />

        {mode === 'edit' && (
          <div className="px-13 py-15">
            <SolidButton size="m" variant="warning" onClick={openDeleteAlert}>
              해당 그룹 삭제하기
            </SolidButton>
          </div>
        )}
      </div>

      {/** bottom sticky button
       * view: null, create: 생성하기, edit: 수정하기 */}
      <div className="px-13 py-16 pt-13">
        {sticky && (
          <SolidButton
            size="l"
            variant="primary"
            isDisabled={sticky.disabled}
            onClick={sticky.onClick}
          >
            {sticky.label}
          </SolidButton>
        )}
      </div>
    </div>
  );
};
