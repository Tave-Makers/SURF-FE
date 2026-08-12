'use client';

import { useDebouncedValue } from '@surf/hooks';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { useActiveGenerationQuery } from '@/entities/active-cohort/model/queries/useActiveGenerationQuery';
import { isTeamScoreCriterion } from '@/entities/activity-score/model/criterion';
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
    refetch: refetchActivityTypes,
  } = useActivityTypesQuery();

  const {
    data: partMemberGroups = [],
    isLoading: isPartGroupsLoading,
    isError: isPartGroupsError,
    refetch: refetchPartGroups,
  } = useGroupedMembersByPartQuery({
    generation: activeCohort?.generation,
    enabled: targetKind === 'part',
  });

  const {
    data: teams = [],
    isLoading: isTeamsLoading,
    isError: isTeamsError,
    refetch: refetchTeams,
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

  // URL로 직접 진입하는 경우를 대비한 방어. 팀 대상 활동은 회원 선택으로 부여할 수 없다.
  const isTeamCriterion = criterion != null && isTeamScoreCriterion(criterion);

  // 입력창은 keyword로 즉시 반응하고, 대량 목록 필터링은 입력이 멎은 뒤에만 수행한다.
  const debouncedKeyword = useDebouncedValue(keyword, 300);
  const normalizedKeyword = debouncedKeyword.trim();

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

  /**
   * 탭을 바꾸면 선택도 함께 비운다.
   * 선택을 유지하면 화면에 보이지 않는 회원이 선택 상태로 남아 의도치 않게 점수가 부여된다.
   */
  const changeTargetKind = (kind: ScoreTargetKind) => {
    setTargetKind(kind);
    setOpenGroupIds(new Set());
    setSelectedIds(new Set());
  };

  const applyScore = () => {
    if (!criterion || isTeamCriterion || selectedIds.size === 0) return;

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
                category: criterion.category,
                activityName: criterion.activityName,
                activityDate: getTodayDateString(),
              },
              {
                onSuccess: () => {
                  showToast('점수가 적용되었습니다.');
                  router.push(PAGE_ROUTES.SCORE_MNG);
                },
                onError: () => showToast('점수를 적용하지 못했습니다. 잠시 후 다시 시도해주세요.'),
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

  /** 현재 탭에서 실패한 조회만 다시 실행한다. */
  const retry = useCallback(() => {
    if (isActivityTypesError) void refetchActivityTypes();
    if (targetKind === 'part') {
      if (isPartGroupsError) void refetchPartGroups();

      return;
    }
    if (isTeamsError) void refetchTeams();
  }, [
    isActivityTypesError,
    isPartGroupsError,
    isTeamsError,
    refetchActivityTypes,
    refetchPartGroups,
    refetchTeams,
    targetKind,
  ]);

  return {
    state: {
      criterion,
      isTeamCriterion,
      keyword,
      targetKind,
      partGroups,
      teams,
      openGroupIds,
      selectedIds,
      isLoading,
      isError,
      isApplyDisabled: selectedIds.size === 0 || !criterion || isTeamCriterion || isCreatePending,
    },
    actions: {
      setKeyword,
      changeTargetKind,
      toggleGroup,
      toggleMember,
      toTargetMembers,
      applyScore,
      retry,
    },
  };
};
