import { MemberSearchItemDTO, MemberSearchRequestDTO } from '../api/types';
import { MemberSearchFilters, MemberSearchItem } from '@/entities/search/model/types';
import { mapUserLevel } from '@/entities/user/model/mappers';

export function mapMemberSearchItem(dto: MemberSearchItemDTO): MemberSearchItem {
  return {
    userId: dto.memberId,
    name: dto.username,
    university: dto.university,
    bio: dto.selfIntroduction,
    avatarUrl: dto.profileImageUrl,
    level: mapUserLevel(dto.role),
    chips: dto.trackList.map((t) => `${t.generation}기 ${t.part}`),
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
    keyword: filters.keyword || undefined,
    generation: filters.generation ?? undefined,
    part: filters.part ?? undefined,
  };
}
