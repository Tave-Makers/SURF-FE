import { toMemberStatus, toMemberTrack } from '@/entities/member/model/mapper';
import { SignupRequestItem } from '../api/types';
import { SignupRequestMember } from '@/entities/signup-request/model/types';

export function toSignupRequestMemberList(data: SignupRequestItem[]): SignupRequestMember[] {
  return data.map((dto) => ({
    id: dto.memberId,
    name: dto.username ?? '',
    university: dto.university ?? '',
    profileImageUrl: dto.profileImageUrl ?? '',
    tracks: (dto.trackList ?? []).map(toMemberTrack),
    registeredAt: dto.createdAt ?? '',
    status: toMemberStatus(dto.memberStatus),
    role: dto.role ?? 'MEMBER',
  }));
}
