import { CommonResponse } from '@/shared/api/types';
import { Nullable } from '@/shared/types/nullable';
import { MemberRole, TrackPart } from '../model/types';

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
  memberStatus?: 'REGISTERING' | 'WAITING' | 'APPROVED' | 'REJECTED' | 'WITHDRAWN';
  isActive?: boolean;
  trackList?: ApiTrack[];
  careerList?: ApiCareer[];
};

/**
 * 멤버 정보 조회 응답
 */
export type MemberInfoResponse = CommonResponse<MemberInformationResDTO>;
