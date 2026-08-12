import type {
  ApiCareer,
  MemberGroupedByPartDTO,
  MemberInformationResDTO,
  MemberItem,
} from '../api/types';

import { PART_LABELS } from './constants';
import type {
  Career,
  Member,
  MemberBase,
  MemberStatus,
  MemberTrack,
  PartMemberGroup,
  TrackPart,
} from './types';

export const MEMBER_STATUS_MAP: Record<string, MemberStatus> = {
  REGISTERING: 'waiting',
  WAITING: 'waiting',
  APPROVED: 'approve',
  REJECTED: 'reject',
  WITHDRAWN: 'reject',
};

export function toMemberStatus(status?: string): MemberStatus {
  if (!status) {
    return 'waiting';
  }

  return MEMBER_STATUS_MAP[status] ?? 'waiting';
}

export function toMemberTrack(track: { generation?: number; part?: string }): MemberTrack {
  return {
    generation: track.generation ?? 0,
    part: (track.part ?? 'BACKEND') as TrackPart,
  };
}

function formatPhoneNumber(digits: string) {
  return `${digits.substring(0, 3)}.${digits.substring(3, 7)}.${digits.substring(7)}`;
}

function toCareer(career: ApiCareer): Career {
  return {
    careerId: career.careerId ?? 0,
    companyName: career.companyName ?? '',
    position: career.position ?? '',
    startDate: career.startDate,
    endDate: career.endDate ?? null,
    isWorking: career.isWorking ?? false,
  };
}

/**
 * API 멤버 아이템 DTO → 도메인 MemberBase 변환
 */
export function toMemberBase(dto: MemberItem): MemberBase {
  return {
    id: dto.memberId,
    name: dto.username ?? '',
    university: dto.university ?? '',
    profileImageUrl: dto.profileImageUrl ?? '',
    tracks: (dto.trackList ?? []).map(toMemberTrack),
    registeredAt: dto.createdAt ?? '',
    status: toMemberStatus(dto.memberStatus),
    role: dto.role ?? 'MEMBER',
  };
}

/**
 * 파트별 그룹 DTO → 도메인 PartMemberGroup 변환
 */
export function toPartMemberGroup(dto: MemberGroupedByPartDTO): PartMemberGroup {
  const part = dto.part ?? '';

  return {
    part,
    partLabel: dto.partDisplayName ?? PART_LABELS[part as TrackPart] ?? part,
    members: (dto.members ?? []).map((member) => ({
      id: member.memberId,
      name: member.name ?? '',
      profileImageUrl: member.profileImageUrl ?? '',
      tracks: (member.tracks ?? []).map(toMemberTrack),
    })),
  };
}

/**
 * API 멤버 상세 DTO → 도메인 Member 변환
 */
export function toMemberDetail(dto: MemberInformationResDTO, memberId: number): Member {
  return {
    id: memberId,
    name: dto.username ?? '',
    email: dto.email ?? '',
    phoneNumber: formatPhoneNumber(dto.phoneNumber ?? ''),
    role: dto.role ?? 'MEMBER',
    university: dto.university ?? '',
    profileImageUrl: dto.profileImageUrl ?? '',
    tracks: (dto.trackList ?? []).map(toMemberTrack),
    registeredAt: dto.createdAt ?? '',
    status: toMemberStatus(dto.memberStatus),
    link: dto.link ?? null,
    graduateSchool: dto.graduateSchool ?? null,
    activityScore: dto.activityScore ?? 0,
    isActive: dto.isActive ?? false,
    careers: (dto.careerList ?? []).map(toCareer),
  };
}
