'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useActiveGenerationQuery } from '@/entities/active-cohort/model/queries/useActiveGenerationQuery';
import { useMemberScoreRankingQuery } from '@/entities/activity-score/model/queries/useMemberScoreRankingQuery';
import type { ScoreGroupKind, ScoreListFilter } from '@/entities/activity-score/model/types';
import { ScoreFilterChip } from '@/entities/activity-score/ui/ScoreFilterChip';
import { ScoreFloatingActionButton } from '@/entities/activity-score/ui/ScoreFloatingActionButton';
import { ScoreGroupScoreList } from '@/entities/activity-score/ui/ScoreGroupScoreList';
import {
  ScoreMemberScoreList,
  ScoreTableHeader,
} from '@/entities/activity-score/ui/ScoreMemberScoreList';
import { useTeamsQuery } from '@/entities/team/model/queries/useTeamsQuery';
import { PAGE_ROUTES } from '@/shared/config/path';

const FILTER_LABELS: Record<ScoreListFilter, string> = {
  individual: '개인',
  study: '스터디',
  project: '프로젝트',
};

const FILTER_ORDER: ScoreListFilter[] = ['individual', 'study', 'project'];

const GROUP_EMPTY_MESSAGES: Record<ScoreGroupKind, string> = {
  study: '진행중인 스터디가 없습니다.',
  project: '진행중인 프로젝트가 없습니다.',
};

const SCORE_RANKING_PAGE_SIZE = 50;

export const ScoreManagementPage = () => {
  const router = useRouter();
  const [filter, setFilter] = useState<ScoreListFilter>('individual');

  const isIndividual = filter === 'individual';

  // 활동 기수 설정에서 지정된 기수의 팀만 노출한다.
  // 기수를 확정하기 전에 팀을 조회하면 전 기수 팀이 섞여 나오므로, 조회 성공 이후에만 팀을 요청한다.
  const {
    data: activeCohort,
    isLoading: isActiveCohortLoading,
    isError: isActiveCohortError,
  } = useActiveGenerationQuery();
  const activeGeneration = activeCohort?.generation;

  const {
    data: members = [],
    isLoading: isMemberRankingLoading,
    isError: isMemberRankingError,
    fetchNextPage: fetchNextMemberRankingPage,
    hasNextPage: hasNextMemberRankingPage,
    isFetchingNextPage: isFetchingNextMemberRankingPage,
  } = useMemberScoreRankingQuery({
    pageSize: SCORE_RANKING_PAGE_SIZE,
    enabled: isIndividual,
  });

  const {
    data: teams = [],
    isLoading: isTeamsLoading,
    isError: isTeamsError,
  } = useTeamsQuery({
    kind: isIndividual ? 'study' : filter,
    generation: activeGeneration,
    enabled: !isIndividual && activeGeneration != null,
  });

  const sortedMembers = useMemo(
    () => [...members].sort((a, b) => b.totalScore - a.totalScore),
    [members],
  );

  const handleClickMember = (memberId: number) => {
    router.push(PAGE_ROUTES.SCORE_MNG_MEMBER(memberId));
  };

  const isError = isIndividual ? isMemberRankingError : isActiveCohortError || isTeamsError;
  const isLoading = isIndividual
    ? isMemberRankingLoading
    : !isError && (isActiveCohortLoading || activeGeneration == null || isTeamsLoading);

  const memberRankingTriggerRef = useInfiniteScroll({
    enabled: isIndividual && !isLoading && !isError,
    hasNextPage: hasNextMemberRankingPage,
    isFetching: isFetchingNextMemberRankingPage,
    onLoadMore: () => {
      void fetchNextMemberRankingPage();
    },
  });

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="border-border-normal flex items-center border-b px-13 pb-10">
        <div className="flex gap-10">
          {FILTER_ORDER.map((value) => (
            <ScoreFilterChip
              key={value}
              isSelected={filter === value}
              onClick={() => setFilter(value)}
            >
              {FILTER_LABELS[value]}
            </ScoreFilterChip>
          ))}
        </div>
      </div>

      <div className="scrollbar-hide flex-1 overflow-y-auto pb-20">
        <ScoreTableHeader />
        {isLoading && (
          <div className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</div>
        )}
        {isError && (
          <div className="text-body-body9 text-foreground-tertiary px-13 py-12">
            점수 현황을 불러오지 못했습니다.
          </div>
        )}
        {!isLoading && !isError && isIndividual ? (
          <>
            <ScoreMemberScoreList members={sortedMembers} onClickMember={handleClickMember} />
            {hasNextMemberRankingPage && (
              <div ref={memberRankingTriggerRef} className="h-10" aria-hidden="true" />
            )}
            {isFetchingNextMemberRankingPage && (
              <div className="text-body-body9 text-foreground-tertiary px-13 py-8">
                Loading...
              </div>
            )}
          </>
        ) : null}
        {!isLoading && !isError && !isIndividual ? (
          <ScoreGroupScoreList
            key={filter}
            teams={teams}
            emptyMessage={GROUP_EMPTY_MESSAGES[filter]}
            onClickMember={handleClickMember}
          />
        ) : null}
      </div>

      <ScoreFloatingActionButton onClick={() => router.push(PAGE_ROUTES.SCORE_MNG_ASSIGN)} />
    </div>
  );
};
