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
          <p className="text-body-body9 text-foreground-tertiary px-13 py-12">
            회원 목록을 불러오지 못했습니다.
          </p>
        )}
        {!state.isLoading && !state.isError && !state.criterion && (
          <p className="text-body-body9 text-foreground-tertiary px-13 py-12">
            활동 종류를 찾을 수 없습니다.
          </p>
        )}
        {!state.isLoading && !state.isError && state.criterion && state.targetKind === 'part' && (
          <ScoreTargetGroupList
            groups={state.partGroups}
            openIds={state.openGroupIds}
            onToggleGroup={actions.toggleGroup}
            selectedIds={state.selectedIds}
            onToggleMember={actions.toggleMember}
          />
        )}
        {!state.isLoading && !state.isError && state.criterion && state.targetKind !== 'part' && (
          <ScoreTargetTeamList
            teams={state.teams}
            openIds={state.openGroupIds}
            onToggleGroup={actions.toggleGroup}
            filterMembers={actions.filterMembers}
            selectedIds={state.selectedIds}
            onToggleMember={actions.toggleMember}
          />
        )}
      </div>

      <div className="px-13 pt-13 pb-16">
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
