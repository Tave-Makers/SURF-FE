'use client';

import { SurfIcon } from '@surf/ui/icon';
import type { ScoreTargetGroup, ScoreTargetMember } from '../model/types';
import { ScoreTargetMemberList } from './ScoreTargetMemberList';
import { useTeamDetailQuery } from '@/entities/team/model/queries/useTeamDetailQuery';
import type { Team, TeamMember } from '@/entities/team/model/types';

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
  openIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
};

/** 파트별 대상 목록 — 회원 데이터를 이미 가지고 있는 경우 */
export const ScoreTargetGroupList = ({
  groups,
  openIds,
  onToggleGroup,
  selectedIds,
  onToggleMember,
}: ScoreTargetGroupListProps) => {
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
  openIds: Set<string>;
  onToggleGroup: (groupId: string) => void;
  toTargetMembers: (members: TeamMember[]) => ScoreTargetMember[];
};

/** 스터디/프로젝트별 대상 목록 — 펼칠 때 팀 상세로 팀원을 조회한다 */
export const ScoreTargetTeamList = ({
  teams,
  openIds,
  onToggleGroup,
  toTargetMembers,
  selectedIds,
  onToggleMember,
}: ScoreTargetTeamListProps) => {
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
