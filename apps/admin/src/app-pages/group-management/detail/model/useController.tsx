'use client';

import { useToastStore } from '@surf/ui/store/toastStore';
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import type { ReadonlyURLSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { getHeaderConfig } from '@/app-pages/group-management/detail/model/getHeaderConfig';
import { getStickyButtonConfig } from '@/app-pages/group-management/detail/model/getStickyButtonConfig';
import { useAlerts } from '@/app-pages/group-management/detail/model/useAlerts';
import { useBottomSheets } from '@/app-pages/group-management/detail/model/useBottomSheets';

import { useCreateGroupMutation } from '@/features/group-management/model/queries/useCreateGroupMutation';
import { useDeleteGroupMutation } from '@/features/group-management/model/queries/useDeleteGroupMutation';
import { useGroupDetailQuery } from '@/features/group-management/model/queries/useGroupDetailQuery';
import { useUpdateGroupMutation } from '@/features/group-management/model/queries/useUpdateGroupMutation';
import { useGroupFormStore } from '@/features/group-management/model/useGroupFormStore';

import type { GroupFormDraft } from '@/features/group-management/model/useGroupFormStore';
import { PAGE_ROUTES } from '@/shared/config/path';
import type { ContentsType } from '@/shared/types/contents';
import type { GroupManagementMode } from '@/widgets/group-management/model/types';
import { useMemberGenerationListQuery } from '@/widgets/member-directory/model/queries/useMemberGenerationListQuery';

type Params = {
  mode: GroupManagementMode;
  id?: string;

  router: AppRouterInstance;
  searchParams: ReadonlyURLSearchParams;
};

export const useController = ({ mode, id, router, searchParams }: Params) => {
  const showToast = useToastStore((s) => s.show);

  const groupId = id ? Number(id) : undefined;
  const formKey = mode === 'create' ? 'create' : String(id);

  // state
  const [isCreateNavigating, setIsCreateNavigating] = useState<boolean>(false);

  // queries
  const { data: generations, isLoading: isGenerationLoading } = useMemberGenerationListQuery();
  const maxGeneration = useMemo(() => {
    const gens = generations ?? [];
    return gens.length > 0 ? Math.max(...gens) : 0;
  }, [generations]);

  const { data: groupDetail, isLoading: isGroupDetailLoading } = useGroupDetailQuery(groupId);

  // mutations
  const { mutateAsync: createGroup, isPending: isCreatePending } = useCreateGroupMutation();
  const { mutateAsync: updateGroup, isPending: isEditPending } = useUpdateGroupMutation(groupId);
  const { mutateAsync: deleteGroup } = useDeleteGroupMutation(groupId);

  // store selectors
  const hasForm = useGroupFormStore((s) => s.forms[formKey] != null);
  const draft = useGroupFormStore((s) => s.forms[formKey]?.draft);
  const dirty = useGroupFormStore((s) => s.forms[formKey]?.dirty ?? false);
  const isValid = useGroupFormStore((s) => s.isValid(formKey));
  const canSubmit = dirty && isValid;

  const hydrate = useGroupFormStore((s) => s.hydrate);
  const removeForm = useGroupFormStore((s) => s.removeForm);
  const resetDraft = useGroupFormStore((s) => s.resetDraft);

  const setGeneration = useGroupFormStore((s) => s.setGeneration);
  const setGroupType = useGroupFormStore((s) => s.setGroupType);
  const setGroupName = useGroupFormStore((s) => s.setGroupName);
  const setGroupIntroduction = useGroupFormStore((s) => s.setGroupIntroduction);

  const pickLeader = useGroupFormStore((s) => s.pickLeader);
  const removeMember = useGroupFormStore((s) => s.removeMember);

  const initialDraft = useMemo(
    () => ({
      generation: groupDetail?.generation ?? maxGeneration,
      groupType: groupDetail?.groupType ?? ('study' as ContentsType),
      groupName: groupDetail?.groupName ?? '',
      groupIntroduction: groupDetail?.groupIntroduction ?? '',
      leader: groupDetail?.leader,
      members: groupDetail?.members ?? [],
    }),
    [groupDetail, maxGeneration],
  );

  // hydrate
  useEffect(() => {
    if (hasForm) return;
    const isReady = mode === 'create' ? !isGenerationLoading : !isGroupDetailLoading;
    if (!isReady) return;
    hydrate(formKey, initialDraft);
  }, [hasForm, mode, isGenerationLoading, isGroupDetailLoading, hydrate, formKey, initialDraft]);

  // create 폼 정리
  useEffect(() => {
    if (mode !== 'create') {
      removeForm('create');
    }
  }, [mode, removeForm]);

  const safeDraft: GroupFormDraft = draft ?? {
    generation: maxGeneration,
    groupType: 'study' as ContentsType,
    groupName: '',
    groupIntroduction: '',
    leader: undefined,
    members: [],
  };

  // bottom sheets
  const { openGenerationBottomSheet, openGroupTypeBottomSheet, openPickLeaderBottomSheet } =
    useBottomSheets({
      maxGeneration: maxGeneration,
      selectedGeneration: safeDraft.generation,
      onSelectGeneration: (v) => setGeneration(formKey, v),

      selectedGroupType: safeDraft.groupType,
      onSelectGroupType: (v) => setGroupType(formKey, v),

      members: safeDraft.members,
      onSelectLeader: (m) => pickLeader(formKey, m),
    });

  // handlers
  const handleLeavePage = () => {
    if (mode === 'edit' && groupId) {
      resetDraft(formKey);
      router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(groupId));
      return;
    }
    removeForm(formKey);
    router.back();
  };

  const handleDeleteGroup = async () => {
    if (mode !== 'edit') return;
    await deleteGroup();
    showToast('그룹이 삭제되었습니다.');
    router.back();
  };

  const handleSubmit = async () => {
    const isSubmitPending = mode === 'create' ? isCreatePending : isEditPending;
    if (isSubmitPending) return;

    if (mode === 'create') {
      try {
        const created = await createGroup(safeDraft);
        setIsCreateNavigating(true);
        router.replace(PAGE_ROUTES.GROUP_MNG.VIEW(created.teamId));
      } catch {
        setIsCreateNavigating(false);
      }
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

  // alerts
  const { openSaveEditAlert, openDeleteAlert, openGoBackAlert, openPickLeaderAlert } = useAlerts({
    onSubmitEdit: () => void handleSubmit(),
    onDeleteGroup: () => void handleDeleteGroup(),
    onLeavePage: handleLeavePage,
  });

  // header / sticky
  const header = getHeaderConfig({ mode, onClickEdit: handleSwitchToEdit });

  const sticky = getStickyButtonConfig({
    mode,
    canSubmit,
    isCreatePending,
    isCreateNavigating,
    isEditPending,
    onCreate: () => void handleSubmit(),
    onEdit: openSaveEditAlert,
  });

  return {
    // data
    mode,
    groupId,
    formKey,
    draft,
    dirty,
    safeDraft,

    // ui configs
    header,
    sticky,

    // actions for view
    setGroupName: (v: string) => setGroupName(formKey, v),
    setGroupIntroduction: (v: string) => setGroupIntroduction(formKey, v),
    removeMember: (memberId: number) => removeMember(formKey, memberId),

    openGenerationBottomSheet,
    openGroupTypeBottomSheet,
    openPickLeaderBottomSheet,

    handleAddMembers,

    // alerts exposed
    openDeleteAlert,
    openGoBackAlert,
    openPickLeaderAlert,
  };
};
