import type {
  TeamApiType,
  TeamDetailDto,
  TeamGenerationSectionDto,
  TeamMemberCardDto,
} from '../api/types';
import type { Team, TeamKind, TeamMember } from './types';

export const toTeamApiType = (kind: TeamKind): TeamApiType =>
  kind === 'project' ? 'PROJECT' : 'STUDY';

const toTeamKind = (type: TeamApiType | null): TeamKind =>
  type === 'PROJECT' ? 'project' : 'study';

/** 기수 섹션 구조를 평탄화한다. generation 지정 시 해당 기수만 남긴다. */
export const mapTeamSectionsToTeams = (
  sections: TeamGenerationSectionDto[],
  generation?: number,
): Team[] =>
  sections
    .filter((section) => generation == null || section.generation === generation)
    .flatMap((section) =>
      (section.teams ?? []).map((team) => ({
        id: team.teamId,
        name: team.name ?? '',
        kind: toTeamKind(team.type),
        generation: team.generation ?? section.generation ?? 0,
      })),
    );

export const mapTeamMemberCardDtoToMember = (dto: TeamMemberCardDto): TeamMember => ({
  id: dto.memberId,
  name: dto.name ?? '',
  profileImageUrl: dto.profileImageUrl ?? '',
  tracks: (dto.tracks ?? []).map((track) => ({
    generation: track.generation ?? 0,
    part: track.part ?? '',
  })),
});

/**
 * 팀 상세는 `leader`를 `members`와 별도로 내려준다.
 * 리더가 `members`에 포함되는 응답과 포함되지 않는 응답을 모두 안전하게 다루기 위해
 * 둘을 합친 뒤 memberId 기준으로 중복을 제거한다.
 */
export const mapTeamDetailDtoToMembers = (dto: TeamDetailDto | null): TeamMember[] => {
  if (!dto) return [];

  const cards = [dto.leader, ...(dto.members ?? [])].filter(
    (card): card is TeamMemberCardDto => card != null,
  );

  const membersById = new Map<number, TeamMember>();
  cards.forEach((card) => {
    if (membersById.has(card.memberId)) return;
    membersById.set(card.memberId, mapTeamMemberCardDtoToMember(card));
  });

  return Array.from(membersById.values());
};
