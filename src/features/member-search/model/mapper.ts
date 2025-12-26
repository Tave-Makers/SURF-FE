import { MemberSearchItemDTO } from '../api/types';
import { MemberSearchItem } from '@/entities/search/model/types';
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
