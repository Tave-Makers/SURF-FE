import { MemberRole, TrackPart } from '../model/types';
import { CommonResponse } from '@/shared/api/types';
import { Nullable } from '@/shared/types/nullable';

/**
 * 트랙 정보
 */
export interface ApiTrack {
  generation: number;
  part: TrackPart;
}

export interface ApiCareer {
  careerId: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: Nullable<string>;
  isWorking: boolean;
}

export type ApiMemberStatus = 'REGISTERING' | 'WAITING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';

export type MemberInformationResDTO = {
  username?: string;
  profileImageUrl?: string;
  phoneNumberPublic?: boolean;
  phoneNumber?: string;
  selfIntroduction?: string;
  link?: string;
  email?: string;
  university?: string;
  graduateSchool?: string;
  role?: MemberRole;
  activityScore?: number;
  createdAt?: string;
  memberStatus?: ApiMemberStatus;
  isActive?: boolean;
  trackList?: ApiTrack[];
  careerList?: ApiCareer[];
};

/**
 * 멤버 아이템
 */
export interface MemberItem {
  memberId: number;
  username?: string;
  profileImageUrl?: string;
  university?: string;
  role?: MemberRole;
  createdAt?: string;
  memberStatus?: ApiMemberStatus;
  trackList?: ApiTrack[];
}

/** 전체 멤버 수(전체 합) */
export interface MemberCountDTO {
  membersCount: number;
}
export type MemberCountResponse = CommonResponse<MemberCountDTO>;
/**
 * 멤버 정보 조회 응답
 */
export type MemberInfoResponse = CommonResponse<MemberInformationResDTO>;
