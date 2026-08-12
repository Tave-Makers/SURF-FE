'use client';

import { SurfIcon } from '@surf/ui/icon';
import type { ScoreTargetGroup, ScoreTargetMember } from '../model/types';
import { ScoreTargetMemberList } from './ScoreTargetMemberList';
import { useTeamDetailQuery } from '@/entities/team/model/queries/useTeamDetailQuery';
import type { Team, TeamMember } from '@/entities/team/model/types';
import CareerEmpty from '@/shared/assets/icons/career-empty.svg';

type ScoreTargetSelection = {
  selectedIds: Set<number>;
  onToggleMember: (memberId: number) => void;
};

type ScoreTargetGroupSectionProps = ScoreTargetSelection & {
  title: string;
  members: ScoreTargetMember[];
  isOpen: boolean;
  onToggle: () => void;
  isLoading?: boolean;
  isError?: boolean;
};

const ScoreTargetEmptyState = ({ message }: { message: string }) => (
  <div className="flex min-h-full w-full items-center justify-center px-13 py-10">
    <div className="flex flex-col items-center gap-5 text-center">
      <CareerEmpty />
      <p className="text-body-body8 text-foreground-tertiary">{message}</p>
    </div>
  </div>
);

export const ScoreTargetGroupSection = ({
  title,
  members,
  isOpen,
  onToggle,
  isLoading = false,
  isError = false,
  selectedIds,
  onToggleMember,
}: ScoreTargetGroupSectionProps) => {
  return (
    <section className="border-border-quaternary border-b">
      <button
        type="button"
        className="text-body-body6 text-foreground-normal flex h-[3.5rem] w-full items-center justify-between px-13"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="truncate">{title}</span>
        <SurfIcon
          name="ChevronDown"
          size="l"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && isLoading && (
        <p className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</p>
      )}
      {isOpen && isError && (
        <p className="text-body-body9 text-foreground-tertiary px-13 py-12">
          회원 목록을 불러오지 못했습니다.
        </p>
      )}
      {isOpen && !isLoading && !isError && members.length === 0 && (
        <p className="text-body-body9 text-foreground-tertiary px-13 py-12">회원이 없습니다.</p>
      )}
      {isOpen && !isLoading && !isError && members.length > 0 && (
        <ScoreTargetMemberList
          members={members}
          selectedIds={selectedIds}
          onToggle={onToggleMember}
        />
      )}
    </section>
  );
};

type ScoreTargetGroupListProps = ScoreTargetSelection & {
  groups: ScoreTargetGroup[];
  emptyMessage: string;
  openIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
};

/** 파트별 대상 목록 — 회원 데이터를 이미 가지고 있는 경우 */
export const ScoreTargetGroupList = ({
  groups,
  emptyMessage,
  openIds,
  onToggleGroup,
  selectedIds,
  onToggleMember,
}: ScoreTargetGroupListProps) => {
  if (groups.length === 0) {
    return <ScoreTargetEmptyState message={emptyMessage} />;
  }

  return (
    <div>
      {groups.map((group) => (
        <ScoreTargetGroupSection
          key={group.id}
          title={group.title}
          members={group.members}
          isOpen={openIds.has(group.id)}
          onToggle={() => onToggleGroup(group.id)}
          selectedIds={selectedIds}
          onToggleMember={onToggleMember}
        />
      ))}
    </div>
  );
};

type ScoreTargetTeamSectionProps = ScoreTargetSelection & {
  team: Team;
  isOpen: boolean;
  onToggle: () => void;
  toTargetMembers: (members: TeamMember[]) => ScoreTargetMember[];
};

const ScoreTargetTeamSection = ({
  team,
  isOpen,
  onToggle,
  toTargetMembers,
  selectedIds,
  onToggleMember,
}: ScoreTargetTeamSectionProps) => {
  const {
    data: members = [],
    isLoading,
    isError,
  } = useTeamDetailQuery({ teamId: team.id, enabled: isOpen });

  return (
    <ScoreTargetGroupSection
      title={team.name}
      members={toTargetMembers(members)}
      isOpen={isOpen}
      onToggle={onToggle}
      isLoading={isLoading}
      isError={isError}
      selectedIds={selectedIds}
      onToggleMember={onToggleMember}
    />
  );
};

type ScoreTargetTeamListProps = ScoreTargetSelection & {
  teams: Team[];
  emptyMessage: string;
  openIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
  toTargetMembers: (members: TeamMember[]) => ScoreTargetMember[];
};

/** 스터디/프로젝트별 대상 목록 — 펼칠 때 팀 상세로 팀원을 조회한다 */
export const ScoreTargetTeamList = ({
  teams,
  emptyMessage,
  openIds,
  onToggleGroup,
  toTargetMembers,
  selectedIds,
  onToggleMember,
}: ScoreTargetTeamListProps) => {
  if (teams.length === 0) {
    return <ScoreTargetEmptyState message={emptyMessage} />;
  }

  return (
    <div>
      {teams.map((team) => (
        <ScoreTargetTeamSection
          key={team.id}
          team={team}
          isOpen={openIds.has(String(team.id))}
          onToggle={() => onToggleGroup(String(team.id))}
          toTargetMembers={toTargetMembers}
          selectedIds={selectedIds}
          onToggleMember={onToggleMember}
        />
      ))}
    </div>
  );
};
