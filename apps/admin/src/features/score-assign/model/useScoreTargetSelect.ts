'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useActiveGenerationQuery } from '@/entities/active-cohort/model/queries/useActiveGenerationQuery';
import { useActivityTypesQuery } from '@/entities/activity-score/model/queries/useActivityTypesQuery';
import { useCreateActivityRecordMutation } from '@/entities/activity-score/model/queries/useCreateActivityRecordMutation';
import type {
  ScoreTargetGroup,
  ScoreTargetKind,
  ScoreTargetMember,
} from '@/entities/activity-score/model/types';
import { PART_LABELS } from '@/entities/member/model/constants';
import { useGroupedMembersByPartQuery } from '@/entities/member/model/queries/useGroupedMembersByPartQuery';
import type { MemberSummary, TrackPart } from '@/entities/member/model/types';
import { useTeamsQuery } from '@/entities/team/model/queries/useTeamsQuery';
import type { TeamMember } from '@/entities/team/model/types';
import { PAGE_ROUTES } from '@/shared/config/path';

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toPartLabel = (part: string) => PART_LABELS[part as TrackPart] ?? part;

/** 팀 상세 / 파트 그룹 응답 모두 `tracks` 구조가 같아 동일하게 변환한다. */
const toTargetMember = (member: TeamMember | MemberSummary): ScoreTargetMember => {
  const [primaryTrack] = member.tracks;

  return {
    id: member.id,
    name: member.name,
    profileImageUrl: member.profileImageUrl,
    generation: primaryTrack?.generation ?? 0,
    partName: primaryTrack ? toPartLabel(primaryTrack.part) : '',
    trackCount: member.tracks.length,
  };
};

export const useScoreTargetSelect = (criterionId: string) => {
  const router = useRouter();
  const openAlert = useAlertStore((state) => state.open);
  const closeAlert = useAlertStore((state) => state.close);
  const showToast = useToastStore((state) => state.show);
  const { mutate: createActivityRecord, isPending: isCreatePending } =
    useCreateActivityRecordMutation();

  const [keyword, setKeyword] = useState('');
  const [targetKind, setTargetKind] = useState<ScoreTargetKind>('part');
  const [openGroupIds, setOpenGroupIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const { data: activeCohort } = useActiveGenerationQuery();

  const {
    data: categories = [],
    isLoading: isActivityTypesLoading,
    isError: isActivityTypesError,
  } = useActivityTypesQuery();

  const {
    data: partMemberGroups = [],
    isLoading: isPartGroupsLoading,
    isError: isPartGroupsError,
  } = useGroupedMembersByPartQuery({
    generation: activeCohort?.generation,
    enabled: targetKind === 'part',
  });

  const {
    data: teams = [],
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useTeamsQuery({
    kind: targetKind === 'part' ? 'study' : targetKind,
    generation: activeCohort?.generation,
    enabled: targetKind !== 'part',
  });

  const criterion = useMemo(
    () =>
      categories.flatMap((category) => category.criteria).find((item) => item.id === criterionId),
    [categories, criterionId],
  );

  const normalizedKeyword = keyword.trim();

  /** 검색은 회원 이름으로만 수행한다. */
  const filterByKeyword = useCallback(
    (members: ScoreTargetMember[]) => {
      if (!normalizedKeyword) return members;

      return members.filter((member) => member.name.includes(normalizedKeyword));
    },
    [normalizedKeyword],
  );

  const toTargetMembers = useCallback(
    (members: TeamMember[]) => filterByKeyword(members.map(toTargetMember)),
    [filterByKeyword],
  );

  const partGroups = useMemo<ScoreTargetGroup[]>(
    () =>
      partMemberGroups.map((group) => ({
        id: group.part,
        title: group.partLabel,
        members: filterByKeyword(group.members.map(toTargetMember)),
      })),
    [partMemberGroups, filterByKeyword],
  );

  const toggleGroup = (groupId: string) => {
    setOpenGroupIds((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);

      return next;
    });
  };

  const toggleMember = (memberId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);

      return next;
    });
  };

  const changeTargetKind = (kind: ScoreTargetKind) => {
    setTargetKind(kind);
    setOpenGroupIds(new Set());
  };

  const applyScore = () => {
    if (!criterion || selectedIds.size === 0) return;

    openAlert({
      title: '적용하시겠습니까?',
      infoText: '적용하기 버튼을 누를 시, 점수가 회원에게 반영됩니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'primary',
          label: '적용하기',
          onClick: () => {
            closeAlert();
            createActivityRecord(
              {
                memberIdList: Array.from(selectedIds),
                category: criterion.category ?? criterion.categoryId,
                activityName: criterion.activityName ?? criterion.id,
                activityDate: getTodayDateString(),
              },
              {
                onSuccess: () => {
                  showToast('점수가 적용되었습니다.');
                  router.push(PAGE_ROUTES.SCORE_MNG);
                },
                onError: (error) => showToast(error.message),
              },
            );
          },
        },
      ],
    });
  };

  const isLoading =
    isActivityTypesLoading || (targetKind === 'part' ? isPartGroupsLoading : isTeamsLoading);
  const isError =
    isActivityTypesError || (targetKind === 'part' ? isPartGroupsError : isTeamsError);

  return {
    state: {
      criterion,
      keyword,
      targetKind,
      partGroups,
      teams,
      openGroupIds,
      selectedIds,
      isLoading,
      isError,
      isApplyDisabled: selectedIds.size === 0 || !criterion || isCreatePending,
    },
    actions: {
      setKeyword,
      changeTargetKind,
      toggleGroup,
      toggleMember,
      toTargetMembers,
      applyScore,
    },
  };
};
