import { MemberTrack } from '@/entities/member/model/types';
import { SignupRequestMember } from '@/entities/signup-request/model/types';
import { SignupRequestItem, Track } from '../api/types';

/**
 * API Track DTO → 도메인 MemberTrack 변환
 *
 * @param trackDto - API Track DTO
 * @returns 도메인 MemberTrack
 */
function toMemberTrack(trackDto: Track): MemberTrack {
  return {
    generation: trackDto.generation,
    part: trackDto.part,
  };
}

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
    id: dto.memberId, // memberId → id
    name: dto.username, // username → name
    university: dto.university,
    profileImageUrl: dto.profileImageUrl,
    tracks: dto.trackList.map(toMemberTrack), // trackList → tracks
    registeredAt: new Date(dto.createdAt), // string → Date
    status: 'waiting', // 초기값 설정 (서버에서 제공하지 않음)
  };
}
