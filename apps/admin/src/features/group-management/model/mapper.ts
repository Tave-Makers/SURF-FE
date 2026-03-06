import { GenerationGroup } from '@/entities/group-management/model/types';
import { toMemberTrack } from '@/entities/member/model/mapper';
import { MemberSummary } from '@/entities/member/model/types';
import {
  GroupRequest,
  GroupApiType,
  GroupDetailResDto,
  GroupGenerationResDto,
  MemberCardDto,
} from '@/features/group-management/api/types';
import { GroupFormDraft } from '@/features/group-management/model/useGroupFormStore';
import { ContentsType } from '@/shared/types/contents';

const contentsToApiMap: Record<ContentsType, GroupApiType> = {
  study: 'STUDY',
  project: 'PROJECT',
};

const apiToContentsMap: Record<GroupApiType, ContentsType> = {
  STUDY: 'study',
  PROJECT: 'project',
};

export const mapContentsTypeToGroupApiType = (type: ContentsType) => contentsToApiMap[type];

export const mapGroupApiTypeToContentsType = (type: GroupApiType) => apiToContentsMap[type];

// 그룹 리스트 조회 매핑
// GroupGenerationResDto[] → GenerationGroup[]

export const mapGroupGenerationResDtoToGenerationGroups = (
  dtoList: GroupGenerationResDto[],
): GenerationGroup[] => {
  return dtoList.map((dto) => ({
    generation: dto.generation,
    groupList: dto.teams.map((team) => ({
      id: team.teamId,
      name: team.name,
      type: mapGroupApiTypeToContentsType(team.type),
    })),
  }));
};

// MemberCardDto -> MemberSummary
const mapMemberCardDtoToMemberSummary = (dto: MemberCardDto): MemberSummary => {
  return {
    id: dto.memberId,
    name: dto.name,
    profileImageUrl: dto.profileImageUrl ?? '',
    tracks: (dto.tracks ?? []).map(toMemberTrack),
  };
};

// 그룹 상세 조회 매핑
// GroupDetailResDto -> GroupFormDraft
export const mapGroupDetailResDtoToGroupFormDraft = (dto: GroupDetailResDto): GroupFormDraft => {
  return {
    generation: dto.generation,
    groupType: mapGroupApiTypeToContentsType(dto.type),
    groupName: dto.name,
    groupIntroduction: dto.description,
    leader: dto.leader ? mapMemberCardDtoToMemberSummary(dto.leader) : undefined,
    members: dto.members.map(mapMemberCardDtoToMemberSummary),
  };
};

// memberIds에 팀장 id 추가
const buildMemberIdsIncludingLeader = (draft: GroupFormDraft): number[] => {
  const ids = new Set<number>();

  if (draft.leader) ids.add(draft.leader.id);
  draft.members.forEach((m) => ids.add(m.id));

  return Array.from(ids);
};

// 그룹 관련 요청 바디 매핑 (ex. 생성, 수정)
export const mapGroupDraftToReq = (draft: GroupFormDraft): GroupRequest => {
  if (!draft.leader) {
    throw new Error('Leader is required to create a group');
  }

  return {
    generation: draft.generation,
    type: mapContentsTypeToGroupApiType(draft.groupType),
    name: draft.groupName,
    description: draft.groupIntroduction,
    leaderMemberId: draft.leader.id,
    memberIds: buildMemberIdsIncludingLeader(draft),
  };
};
