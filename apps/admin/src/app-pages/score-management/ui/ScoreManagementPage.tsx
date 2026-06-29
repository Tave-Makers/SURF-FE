'use client';

import { SurfIcon } from '@surf/ui/icon';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useMemberScoreRankingQuery } from '@/entities/activity-score/model/queries/useMemberScoreRankingQuery';
import { useTeamScoreRankingQuery } from '@/entities/activity-score/model/queries/useTeamScoreRankingQuery';
import type { ScoreGroupKind, ScoreViewMode } from '@/entities/activity-score/model/types';
import { ScoreFilterChip } from '@/entities/activity-score/ui/ScoreFilterChip';
import { ScoreFloatingActionButton } from '@/entities/activity-score/ui/ScoreFloatingActionButton';
import { ScoreGroupScoreList } from '@/entities/activity-score/ui/ScoreGroupScoreList';
import {
  ScoreMemberScoreList,
  ScoreTableHeader,
} from '@/entities/activity-score/ui/ScoreMemberScoreList';
import { PAGE_ROUTES } from '@/shared/config/path';

type SortMode = 'generation' | 'name';

const sortLabels: Record<SortMode, string> = {
  generation: '기수별',
  name: '이름별',
};

const SCORE_RANKING_PAGE_SIZE = 50;

export const ScoreManagementPage = () => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ScoreViewMode>('individual');
  const [groupKind, setGroupKind] = useState<ScoreGroupKind>('study');
  const [sortMode, setSortMode] = useState<SortMode>('generation');

  const {
    data: members = [],
    isLoading: isMemberRankingLoading,
    isError: isMemberRankingError,
  } = useMemberScoreRankingQuery({
    pageNum: 0,
    pageSize: SCORE_RANKING_PAGE_SIZE,
    enabled: viewMode === 'individual',
  });

  const {
    data: teams = [],
    isLoading: isTeamRankingLoading,
    isError: isTeamRankingError,
  } = useTeamScoreRankingQuery({
    kind: groupKind,
    pageNum: 0,
    pageSize: SCORE_RANKING_PAGE_SIZE,
    enabled: viewMode === 'group',
  });

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name, 'ko');
      return b.generation - a.generation;
    });
  }, [members, sortMode]);

  const sortedTeams = useMemo(() => {
    return [...teams].sort((a, b) => {
      if (sortMode === 'name') return a.name.localeCompare(b.name, 'ko');
      return b.totalScore - a.totalScore;
    });
  }, [teams, sortMode]);

  const handleClickMember = (memberId: number) => {
    router.push(PAGE_ROUTES.SCORE_MNG_MEMBER(memberId));
  };

  const isLoading = viewMode === 'individual' ? isMemberRankingLoading : isTeamRankingLoading;
  const isError = viewMode === 'individual' ? isMemberRankingError : isTeamRankingError;

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      <div className="border-border-normal flex items-center justify-between border-b px-13 py-10">
        <div className="flex gap-8">
          {viewMode === 'individual' ? (
            <>
              <ScoreFilterChip isSelected={true} onClick={() => setViewMode('individual')}>
                개인별
              </ScoreFilterChip>
              <ScoreFilterChip isSelected={false} onClick={() => setViewMode('group')}>
                그룹별
              </ScoreFilterChip>
            </>
          ) : (
            <>
              <ScoreFilterChip isSelected={false} onClick={() => setViewMode('individual')}>
                개인
              </ScoreFilterChip>
              <ScoreFilterChip
                isSelected={groupKind === 'study'}
                onClick={() => setGroupKind('study')}
              >
                스터디
              </ScoreFilterChip>
              <ScoreFilterChip
                isSelected={groupKind === 'project'}
                onClick={() => setGroupKind('project')}
              >
                프로젝트
              </ScoreFilterChip>
            </>
          )}
        </div>

        <button
          type="button"
          className="text-body-body9 text-foreground-normal flex items-center gap-4 px-4 py-6"
          onClick={() => setSortMode((prev) => (prev === 'generation' ? 'name' : 'generation'))}
        >
          <span>{sortLabels[sortMode]}</span>
          <SurfIcon name="ChevronDown" size="s" />
        </button>
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
        {!isLoading && !isError && viewMode === 'individual' ? (
          <ScoreMemberScoreList members={sortedMembers} onClickMember={handleClickMember} />
        ) : null}
        {!isLoading && !isError && viewMode === 'group' ? (
          <ScoreGroupScoreList
            key={groupKind}
            teams={sortedTeams}
            onClickMember={handleClickMember}
          />
        ) : null}
      </div>

      <ScoreFloatingActionButton onClick={() => router.push(PAGE_ROUTES.SCORE_MNG_ASSIGN)} />
    </div>
  );
};
