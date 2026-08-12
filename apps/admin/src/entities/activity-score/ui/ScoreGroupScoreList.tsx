'use client';

import { SurfIcon } from '@surf/ui/icon';
import { useState } from 'react';
import { useTeamMemberScoresQuery } from '../model/queries/useTeamMemberScoresQuery';
import { ScoreMemberScoreList } from './ScoreMemberScoreList';

type ScoreGroupTeam = {
  id: number;
  name: string;
};

type ScoreGroupScoreListProps = {
  teams: ScoreGroupTeam[];
  emptyMessage: string;
  onClickMember: (memberId: number) => void;
};

type ScoreTeamAccordionItemProps = {
  team: ScoreGroupTeam;
  isOpen: boolean;
  onToggle: () => void;
  onClickMember: (memberId: number) => void;
};

const ScoreTeamAccordionItem = ({
  team,
  isOpen,
  onToggle,
  onClickMember,
}: ScoreTeamAccordionItemProps) => {
  const {
    data: members = [],
    isLoading,
    isError,
  } = useTeamMemberScoresQuery({
    teamId: team.id,
    enabled: isOpen,
  });

  return (
    <section className="border-border-quaternary border-b">
      <button
        type="button"
        className="text-body-body8 text-foreground-normal flex h-[3rem] w-full items-center justify-between px-13"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="truncate">{team.name}</span>
        <SurfIcon
          name="ChevronDown"
          size="l"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && isLoading && (
        <div className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</div>
      )}
      {isOpen && isError && (
        <div className="text-body-body9 text-foreground-tertiary px-13 py-12">
          팀원 점수를 불러오지 못했습니다.
        </div>
      )}
      {isOpen && !isLoading && !isError && (
        <ScoreMemberScoreList members={members} onClickMember={onClickMember} />
      )}
    </section>
  );
};

export const ScoreGroupScoreList = ({
  teams,
  emptyMessage,
  onClickMember,
}: ScoreGroupScoreListProps) => {
  const [openIds, setOpenIds] = useState<Set<number>>(new Set());

  const handleToggle = (teamId: number) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(teamId)) next.delete(teamId);
      else next.add(teamId);

      return next;
    });
  };

  if (teams.length === 0) {
    return <p className="text-body-body9 text-foreground-tertiary px-13 py-12">{emptyMessage}</p>;
  }

  return (
    <div>
      {teams.map((team) => (
        <ScoreTeamAccordionItem
          key={team.id}
          team={team}
          isOpen={openIds.has(team.id)}
          onToggle={() => handleToggle(team.id)}
          onClickMember={onClickMember}
        />
      ))}
    </div>
  );
};
