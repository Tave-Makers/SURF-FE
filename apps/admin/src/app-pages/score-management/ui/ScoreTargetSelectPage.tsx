'use client';

import { SolidButton } from '@surf/ui/button';
import { HeaderMode } from '@surf/ui/header';
import { TextInput } from '@surf/ui/text-input';
import type { ScoreTargetKind } from '@/entities/activity-score/model/types';
import { ScoreFilterChip } from '@/entities/activity-score/ui/ScoreFilterChip';
import {
  ScoreTargetGroupList,
  ScoreTargetTeamList,
} from '@/entities/activity-score/ui/ScoreTargetGroupList';
import { useScoreTargetSelect } from '@/features/score-assign/model/useScoreTargetSelect';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

type ScoreTargetSelectPageProps = {
  criterionId: string;
};

const TARGET_LABELS: Record<ScoreTargetKind, string> = {
  part: '파트',
  study: '스터디',
  project: '프로젝트',
};

const TARGET_EMPTY_MESSAGES: Record<ScoreTargetKind, string> = {
  part: '조회 가능한 회원이 없습니다.',
  study: '진행중인 스터디가 없습니다.',
  project: '진행중인 프로젝트가 없습니다.',
};

const TARGET_ORDER: ScoreTargetKind[] = ['part', 'study', 'project'];

export const ScoreTargetSelectPage = ({ criterionId }: ScoreTargetSelectPageProps) => {
  const { state, actions } = useScoreTargetSelect(criterionId);

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: state.criterion?.label ?? '회원 점수 부여',
          hasLeftIcon: true,
        }}
      />

      <div className="px-13 pt-3">
        <TextInput
          mode="search"
          placeholder="회원이름을 검색해주세요"
          iconName="Search"
          value={state.keyword}
          onChange={actions.setKeyword}
          aria-label="회원이름 검색"
        />
      </div>

      <div className="flex gap-10 px-13 py-11">
        {TARGET_ORDER.map((kind) => (
          <ScoreFilterChip
            key={kind}
            isSelected={state.targetKind === kind}
            onClick={() => actions.changeTargetKind(kind)}
          >
            {TARGET_LABELS[kind]}
          </ScoreFilterChip>
        ))}
      </div>

      <div className="scrollbar-hide min-h-0 flex-1 overflow-y-auto">
        {state.isLoading && (
          <p className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</p>
        )}
        {!state.isLoading && state.isError && (
          <div className="flex flex-col items-start gap-8 px-13 py-12">
            <p className="text-body-body9 text-foreground-tertiary">{state.errorMessage}</p>
            <button
              type="button"
              className="rounded-2 border-border-quaternary text-body-body9 text-foreground-normal border px-11 py-7"
              onClick={actions.retry}
            >
              다시 시도
            </button>
          </div>
        )}
        {!state.isLoading && !state.isError && !state.criterion && (
          <p className="text-body-body9 text-foreground-tertiary px-13 py-12">
            활동 종류를 찾을 수 없습니다.
          </p>
        )}
        {!state.isLoading && !state.isError && state.isTeamCriterion && (
          <p className="text-body-body9 text-foreground-tertiary px-13 py-12">
            팀 단위로 부여하는 활동입니다. 회원 개별 부여는 지원하지 않습니다.
          </p>
        )}
        {!state.isLoading &&
          !state.isError &&
          state.criterion &&
          !state.isTeamCriterion &&
          state.targetKind === 'part' && (
            <ScoreTargetGroupList
              groups={state.partGroups}
              emptyMessage={TARGET_EMPTY_MESSAGES.part}
              openIds={state.openGroupIds}
              onToggleGroup={actions.toggleGroup}
              selectedIds={state.selectedIds}
              onToggleMember={actions.toggleMember}
            />
          )}
        {!state.isLoading &&
          !state.isError &&
          state.criterion &&
          !state.isTeamCriterion &&
          state.targetKind !== 'part' && (
            <ScoreTargetTeamList
              teams={state.teams}
              emptyMessage={TARGET_EMPTY_MESSAGES[state.targetKind]}
              openIds={state.openGroupIds}
              onToggleGroup={actions.toggleGroup}
              toTargetMembers={actions.toTargetMembers}
              selectedIds={state.selectedIds}
              onToggleMember={actions.toggleMember}
            />
          )}
      </div>

      <div className="px-13 pt-13 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <SolidButton
          size="l"
          variant="primary"
          isDisabled={state.isApplyDisabled}
          onClick={actions.applyScore}
        >
          적용하기
        </SolidButton>
      </div>
    </div>
  );
};
