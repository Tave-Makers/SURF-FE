import type { MemberInformationResDTO } from '../api/types';

import type { Career, Member, MemberStatus, MemberTrack, TrackPart } from './types';

type ApiCareer = NonNullable<MemberInformationResDTO['careerList']>[number];
type ApiDate = NonNullable<ApiCareer['startDate']>;

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

function formatYearMonth(date?: ApiDate): string {
  if (!date?.year || !date?.monthValue) {
    return '';
  }

  return `${date.year}-${String(date.monthValue).padStart(2, '0')}`;
}

function formatPhoneNumber(digits: string) {
  return `${digits.substring(0, 3)}.${digits.substring(3, 7)}.${digits.substring(7)}`;
}

function toCareer(career: ApiCareer): Career {
  const endDate = formatYearMonth(career.endDate);

  return {
    careerId: career.careerId ?? 0,
    companyName: career.companyName ?? '',
    position: career.position ?? '',
    startDate: formatYearMonth(career.startDate),
    endDate: endDate || null,
    isWorking: career.isWorking ?? false,
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
    role: dto.role ?? '',
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
