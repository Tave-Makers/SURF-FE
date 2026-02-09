import { toMemberRole, toMemberStatus, toMemberTrack } from '@/entities/member/model/mapper';
import { SignupRequestItem } from '../api/types';
import { SignupRequestMember } from '@/entities/signup-request/model/types';

/**
 * API SignupRequestItem DTO → 도메인 SignupRequestMember 변환
 *
 * API 응답의 필드명을 도메인에 맞게 변환하고,
 * 타입을 도메인 모델에 맞게 변환합니다.
 *
 * @param dto - API 응답 DTO
 * @returns 도메인 SignupRequestMember 객체
 *
 */
export function toSignupRequestMember(dto: SignupRequestItem): SignupRequestMember {
  return {
    id: dto.memberId,
    name: dto.username,
    university: dto.university,
    profileImageUrl: dto.profileImageUrl,
    tracks: dto.trackList.map(toMemberTrack),
    registeredAt: dto.createdAt,
    status: toMemberStatus(dto.memberStatus),
    role: toMemberRole(dto.role),
  };
}
