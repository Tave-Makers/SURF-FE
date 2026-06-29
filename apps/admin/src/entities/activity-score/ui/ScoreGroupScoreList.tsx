'use client';

import { SurfIcon } from '@surf/ui/icon';
import { useEffect, useMemo, useState } from 'react';
import { useTeamMemberScoresQuery } from '../model/queries/useTeamMemberScoresQuery';
import type { ActivityScoreTeam } from '../model/types';
import { ScoreMemberScoreList } from './ScoreMemberScoreList';

type ScoreGroupScoreListProps = {
  teams: ActivityScoreTeam[];
  onClickMember: (memberId: number) => void;
};

type ScoreTeamAccordionItemProps = {
  team: ActivityScoreTeam;
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
        <span>{team.name}</span>
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

export const ScoreGroupScoreList = ({ teams, onClickMember }: ScoreGroupScoreListProps) => {
  const initialOpen = useMemo(
    () =>
      teams.reduce<Record<number, boolean>>((acc, team) => {
        acc[team.id] = Boolean(team.defaultOpen);
        return acc;
      }, {}),
    [teams],
  );
  const [openById, setOpenById] = useState(initialOpen);

  useEffect(() => {
    setOpenById(initialOpen);
  }, [initialOpen]);

  return (
    <div>
      {teams.map((team) => (
        <ScoreTeamAccordionItem
          key={team.id}
          team={team}
          isOpen={openById[team.id] ?? false}
          onToggle={() =>
            setOpenById((prev) => ({
              ...prev,
              [team.id]: !(prev[team.id] ?? false),
            }))
          }
          onClickMember={onClickMember}
        />
      ))}
    </div>
  );
};
