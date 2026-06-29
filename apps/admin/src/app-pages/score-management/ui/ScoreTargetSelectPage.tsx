'use client';

import { SolidButton } from '@surf/ui/button';
import { HeaderMode } from '@surf/ui/header';
import { SurfIcon } from '@surf/ui/icon';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { TextInput } from '@surf/ui/text-input';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useActivityTypesQuery } from '@/entities/activity-score/model/queries/useActivityTypesQuery';
import { useCreateActivityRecordMutation } from '@/entities/activity-score/model/queries/useCreateActivityRecordMutation';
import { useMemberScoreRankingQuery } from '@/entities/activity-score/model/queries/useMemberScoreRankingQuery';
import type { ScoreTargetKind } from '@/entities/activity-score/model/types';
import { ScoreFilterChip } from '@/entities/activity-score/ui/ScoreFilterChip';
import { ScoreTargetMemberList } from '@/entities/activity-score/ui/ScoreTargetMemberList';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type ScoreTargetSelectPageProps = {
  criterionId: string;
};

const targetLabels: Record<ScoreTargetKind, string> = {
  part: '파트',
  study: '스터디',
  project: '프로젝트',
};

const targetSectionTitles: Record<ScoreTargetKind, string> = {
  part: '디자인',
  study: '디자인 스터디',
  project: 'SURF 웹 프로젝트',
};

const SCORE_TARGET_PAGE_SIZE = 500;

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const ScoreTargetSelectPage = ({ criterionId }: ScoreTargetSelectPageProps) => {
  const router = useRouter();
  const openAlert = useAlertStore((state) => state.open);
  const closeAlert = useAlertStore((state) => state.close);
  const showToast = useToastStore((state) => state.show);
  const { mutate: createActivityRecord, isPending: isCreatePending } =
    useCreateActivityRecordMutation();

  const [keyword, setKeyword] = useState('');
  const [targetKind, setTargetKind] = useState<ScoreTargetKind>('part');
  const [isSectionOpen, setIsSectionOpen] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const {
    data: categories = [],
    isLoading: isActivityTypesLoading,
    isError: isActivityTypesError,
  } = useActivityTypesQuery();
  const {
    data: targetMembers = [],
    isLoading: isMembersLoading,
    isError: isMembersError,
  } = useMemberScoreRankingQuery({
    pageNum: 0,
    pageSize: SCORE_TARGET_PAGE_SIZE,
  });

  const criterion = useMemo(
    () => categories.flatMap((category) => category.criteria).find((item) => item.id === criterionId),
    [categories, criterionId],
  );

  const filteredMembers = useMemo(() => {
    const normalizedKeyword = keyword.trim();
    if (!normalizedKeyword) return targetMembers;

    return targetMembers.filter((member) => member.name.includes(normalizedKeyword));
  }, [keyword, targetMembers]);

  const handleToggle = (memberId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(memberId)) next.delete(memberId);
      else next.add(memberId);
      return next;
    });
  };

  const handleOpenApplyAlert = () => {
    if (!criterion) return;

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
                onError: (error) => {
                  showToast(error.message);
                },
              },
            );
          },
        },
      ],
    });
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: criterion?.label ?? '회원 점수 부여',
          hasLeftIcon: true,
        }}
      />

      <div className="px-13 pt-3">
        <TextInput
          mode="search"
          placeholder="회원이름을 검색해주세요"
          iconName="Search"
          value={keyword}
          onChange={setKeyword}
          aria-label="회원이름 검색"
        />
      </div>

      <div className="flex gap-8 px-13 py-11">
        {(Object.keys(targetLabels) as ScoreTargetKind[]).map((kind) => (
          <ScoreFilterChip
            key={kind}
            isSelected={targetKind === kind}
            onClick={() => {
              setTargetKind(kind);
              setSelectedIds(new Set());
            }}
          >
            {targetLabels[kind]}
          </ScoreFilterChip>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <button
          type="button"
          className="border-border-quaternary text-body-body6 text-foreground-normal flex h-[3rem] items-center justify-between border-b px-13"
          onClick={() => setIsSectionOpen((prev) => !prev)}
          aria-expanded={isSectionOpen}
        >
          <span>{targetSectionTitles[targetKind]}</span>
          <SurfIcon
            name="ChevronDown"
            size="l"
            className={`transition-transform ${isSectionOpen ? 'rotate-180' : ''}`}
          />
        </button>

        <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
          {(isActivityTypesLoading || isMembersLoading) && (
            <div className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</div>
          )}
          {(isActivityTypesError || isMembersError) && (
            <div className="text-body-body9 text-foreground-tertiary px-13 py-12">
              회원 목록을 불러오지 못했습니다.
            </div>
          )}
          {!isActivityTypesLoading && !isMembersLoading && !criterion && (
            <div className="text-body-body9 text-foreground-tertiary px-13 py-12">
              활동 종류를 찾을 수 없습니다.
            </div>
          )}
          {!isActivityTypesLoading && !isMembersLoading && criterion && isSectionOpen && (
            <ScoreTargetMemberList
              members={filteredMembers}
              selectedIds={selectedIds}
              onToggle={handleToggle}
            />
          )}
        </div>
      </div>

      <div className="px-13 pt-13 pb-16">
        <SolidButton
          size="l"
          variant="primary"
          isDisabled={selectedIds.size === 0 || !criterion || isCreatePending}
          onClick={handleOpenApplyAlert}
        >
          적용하기
        </SolidButton>
      </div>
    </div>
  );
};
