import type { BlockedMemberDTO } from '../api/types';
import type { BlockedMember } from './types';

export const toBlockedMember = (dto: BlockedMemberDTO): BlockedMember => ({
  memberId: dto.memberId,
  name: dto.name,
  profileImageUrl: dto.profileImageUrl ?? undefined,
});
