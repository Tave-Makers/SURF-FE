'use client';

import { useDebouncedValue } from '@surf/hooks';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAssignBadgeMembersMutation } from '@/features/badge/model/queries/useAssignBadgeMembersMutation';
import { useBadgeMembersQuery } from '@/features/badge/model/queries/useBadgeMembersQuery';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useSelectableListState } from '@/shared/hooks/useSelectableListState';
import { useMemberGenerationListQuery } from '@/widgets/member-directory/model/queries/useMemberGenerationListQuery';

/**
 * 배지 부여 화면의 검색, 멤버 선택, 확인 Alert, 부여 요청 플로우를 관리한다.
 */
export const useBadgeAssignPage = (badgeId: number) => {
  const router = useRouter();
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);
  const showToast = useToastStore((s) => s.show);
  const [keyword, setKeyword] = useState('');
  const debouncedKeyword = useDebouncedValue(keyword, 300);

  const { selectedIds, toggleSelect, resetSelectionState } = useSelectableListState<number>({
    initialMode: 'select',
  });

  const { data: generations } = useMemberGenerationListQuery();
  const { data: assignedMembers = [] } = useBadgeMembersQuery(badgeId);
  const { mutateAsync: assignBadgeMembers, isPending } = useAssignBadgeMembersMutation(badgeId);

  const assignedMemberIds = new Set(assignedMembers.map((member) => member.id));

  /** 배지 수정 화면으로 돌아간다. */
  const handleBack = () => {
    router.push(PAGE_ROUTES.BADGE_MNG.EDIT(badgeId));
  };

  /** 선택된 멤버들에게 배지를 부여하고 수정 화면으로 이동한다. */
  const handleSubmit = async () => {
    if (selectedIds.size === 0 || isPending) return;

    try {
      await assignBadgeMembers({ memberIds: [...selectedIds] });
      showToast('배지가 부여되었습니다.');
      resetSelectionState();
      router.replace(PAGE_ROUTES.BADGE_MNG.EDIT(badgeId));
    } catch {
      showToast('배지 부여에 실패했습니다.');
    }
  };

  /** 부여 확인 Alert을 열고 확인 시 실제 부여 요청을 실행한다. */
  const handleOpenAssignAlert = () => {
    if (selectedIds.size === 0 || isPending) return;

    openAlert({
      state: 'default',
      title: '부여하시겠습니까?',
      infoText: `부여하기 버튼을 누를 시, 선택한 ${selectedIds.size}명의 인원에게 활동 배지가 부여됩니다.`,
      actions: [
        { type: 'solid', variant: 'secondary', label: '취소', onClick: closeAlert },
        {
          type: 'solid',
          variant: 'primary',
          label: '부여하기',
          onClick: () => {
            closeAlert();
            void handleSubmit();
          },
        },
      ],
    });
  };

  const bottomActions = [
    {
      key: 'assign',
      label: '부여하기',
      onClick: handleOpenAssignAlert,
      disabled: selectedIds.size === 0 || isPending,
    },
  ];

  return {
    state: {
      keyword,
      debouncedKeyword,
      selectedIds,
      assignedMemberIds,
      generations,
    },
    actions: {
      setKeyword,
      toggleSelect,
      handleBack,
      bottomActions,
    },
  };
};
