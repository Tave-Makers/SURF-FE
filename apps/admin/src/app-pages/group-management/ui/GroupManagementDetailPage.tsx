'use client';

import { SolidButton } from '@surf/ui/button';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';

import { getHeaderConfig } from '@/app-pages/group-management/model/getHeaderConfig';
import { getStickyButtonConfig } from '@/app-pages/group-management/model/getStickyButtonConfig';
import { useGroupManagementAlerts } from '@/app-pages/group-management/model/useGroupManagementAlerts';
import { useGroupManagementBottomSheets } from '@/app-pages/group-management/model/useGroupManagementBottomSheets';

import { useCreateGroupMutation } from '@/features/group-management/model/queries/useCreateGroupMutation';
import { useDeleteGroupMutation } from '@/features/group-management/model/queries/useDeleteGroupMutation';
import { useGroupDetailQuery } from '@/features/group-management/model/queries/useGroupDetailQuery';
import { useUpdateGroupMutation } from '@/features/group-management/model/queries/useUpdateGroupMutation';
import { useGroupFormStore } from '@/features/group-management/model/useGroupFormStore';

import { PAGE_ROUTES } from '@/shared/config/path';
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
  const showToast = useToastStore((s) => s.show);

  const groupId = id ? Number(id) : undefined;
  const formKey = mode === 'create' ? 'create' : String(id);

  // queries / mutations
  const { data: generations } = useMemberGenerationListQuery();
  const MAX_GENERATION = useMemo(() => {
    const gens = generations ?? [];
    return gens.length > 0 ? Math.max(...gens) : 0;
  }, [generations]);

  const { data: groupDetail } = useGroupDetailQuery(groupId);

  const { mutateAsync: createGroup, isPending: isCreatePending } = useCreateGroupMutation();
  const { mutateAsync: updateGroup, isPending: isEditPending } = useUpdateGroupMutation(groupId);
  const { mutateAsync: deleteGroup } = useDeleteGroupMutation(groupId);

  // store selectors / actions
  const draft = useGroupFormStore((s) => s.forms[formKey]?.draft);
  const dirty = useGroupFormStore((s) => s.forms[formKey]?.dirty ?? false);
  const isValid = useGroupFormStore((s) => s.isValid(formKey));
  const canSubmit = dirty && isValid;

  const hydrate = useGroupFormStore((s) => s.hydrate);
  const removeForm = useGroupFormStore((s) => s.removeForm);

  const setGeneration = useGroupFormStore((s) => s.setGeneration);
  const setGroupType = useGroupFormStore((s) => s.setGroupType);
  const setGroupName = useGroupFormStore((s) => s.setGroupName);
  const setGroupIntroduction = useGroupFormStore((s) => s.setGroupIntroduction);

  const pickLeader = useGroupFormStore((s) => s.pickLeader);
  const removeMember = useGroupFormStore((s) => s.removeMember);

  // hydrate (re-run when queries arrive)
  useEffect(() => {
    hydrate(formKey, {
      generation: groupDetail?.generation ?? MAX_GENERATION,
      groupType: groupDetail?.groupType ?? ('study' as ContentsType),
      groupName: groupDetail?.groupName ?? '',
      groupIntroduction: groupDetail?.groupIntroduction ?? '',
      leader: groupDetail?.leader,
      members: groupDetail?.members ?? [],
    });
  }, [hydrate, formKey, groupDetail, MAX_GENERATION]);

  const safeDraft = draft ?? {
    generation: MAX_GENERATION,
    groupType: 'study' as ContentsType,
    groupName: '',
    groupIntroduction: '',
    leader: undefined,
    members: [],
  };

  // bottom sheets
  const { openGenerationBottomSheet, openGroupTypeBottomSheet, openPickLeaderBottomSheet } =
    useGroupManagementBottomSheets({
      maxGeneration: MAX_GENERATION,
      selectedGeneration: safeDraft.generation,
      onSelectGeneration: (v) => setGeneration(formKey, v),

      selectedGroupType: safeDraft.groupType,
      onSelectGroupType: (v) => setGroupType(formKey, v),

      members: safeDraft.members,
      onSelectLeader: (m) => pickLeader(formKey, m),
    });

  // handlers
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

  const handleSubmit = async () => {
    if (mode === 'create') {
      const created = await createGroup(safeDraft);
      router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(created.teamId));
    } else if (mode === 'edit' && groupId) {
      await updateGroup(safeDraft);
      router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
    }
  };

  const handleSwitchToEdit = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('mode', 'edit');
    router.replace(`?${params.toString()}`);
  };

  const handleAddMembers = () => {
    const params = new URLSearchParams();
    params.set('generation', String(safeDraft.generation));
    params.set('formKey', formKey);
    router.push(`${PAGE_ROUTES.GROUP_MNG.MEMBER_SEARCH}?${params.toString()}`);
  };

  // alerts / header / sticky
  const { openSaveEditAlert, openDeleteAlert, openGoBackAlert, openPickLeaderAlert } =
    useGroupManagementAlerts({
      onSubmitEdit: () => void handleSubmit(),
      onDeleteGroup: () => void handleDeleteGroup(),
      onLeavePage: handleLeavePage,
    });

  const header = getHeaderConfig({
    mode,
    onClickEdit: handleSwitchToEdit,
  });

  const sticky = getStickyButtonConfig({
    mode,
    canSubmit,
    isCreatePending,
    isEditPending,
    onCreate: () => void handleSubmit(),
    onEdit: openSaveEditAlert,
  });

  // render
  if (!draft) {
    return (
      <div className="flex h-full flex-col">
        <AppHeader overrideHeader={header} />
        <div className="flex flex-1 items-center justify-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <AppHeader overrideHeader={header} customBack={dirty ? openGoBackAlert : undefined} />

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
          onRemoveMember={(memberId) => removeMember(formKey, memberId)}
        />

        {mode === 'edit' && (
          <div className="px-13 py-15">
            <SolidButton size="m" variant="warning" onClick={openDeleteAlert}>
              해당 그룹 삭제하기
            </SolidButton>
          </div>
        )}
      </div>

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
