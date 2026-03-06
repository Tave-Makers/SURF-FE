import { MemberSearchItemDTO, MemberSearchRequestDTO, GenerationListResDTO } from '../api/types';
import { MemberSearchFilters, MemberSearchItem } from '@/entities/search/model/types';
import { mapUserLevel, toLabelPartMap } from '@/entities/user/model/mappers';
import { GenerationList } from '@/features/member-search/model/types';

export function mapMemberSearchItem(dto: MemberSearchItemDTO): MemberSearchItem {
  return {
    userId: dto.memberId,
    name: dto.username,
    university: dto.university,
    bio: dto.selfIntroduction,
    avatarUrl: dto.profileImageUrl,
    level: mapUserLevel(dto.role),
    chips: dto.trackList.map((t) => `${t.generation}기 ${toLabelPartMap[t.part]}`),
  };
}

export function toMemberSearchRequest(
  filters: MemberSearchFilters,
  pageNum: number,
  pageSize: number,
): MemberSearchRequestDTO {
  return {
    pageNum,
    pageSize,
    keyword: filters.debouncedKeyword || undefined,
    generation: filters.generation ?? undefined,
    part: filters.part ?? undefined,
  };
}

// 기수 목록 API 응답 -> Domain 변환
export function toGenerationList(dto: GenerationListResDTO): GenerationList {
  const picked = (dto?.generations ?? []).filter(
    (item): item is { generation: number } => typeof item?.generation === 'number',
  );

  //  number[]로 변환
  const generations = picked.map((item) => item.generation);

  return generations;
}
