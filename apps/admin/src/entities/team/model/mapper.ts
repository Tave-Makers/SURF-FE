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

export const mapTeamDetailDtoToMembers = (dto: TeamDetailDto | null): TeamMember[] =>
  (dto?.members ?? []).map(mapTeamMemberCardDtoToMember);
