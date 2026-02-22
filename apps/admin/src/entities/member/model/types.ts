import { Nullable } from '@/shared/types/nullable';

/**
 * 파트 타입
 */
export type TrackPart =
  | 'BACKEND'
  | 'WEB_FRONTEND'
  | 'APP_FRONTEND'
  | 'DESIGN'
  | 'DATA_ANALYSIS'
  | 'DEEP_LEARNING';

export type MemberRole = 'ADMIN' | 'PRESIDENT' | 'MANAGER' | 'MEMBER';
/**
 * 멤버 트랙 정보
 */
export interface MemberTrack {
  generation: number; // 기수
  part: TrackPart; // 파트
}

/**
 * 멤버 가입 상태
 */
export type MemberStatus = 'reject' | 'waiting' | 'approve';

/**
 * 멤버 커리어 정보
 */
export interface Career {
  careerId: number;
  companyName: string;
  position: string;
  startDate: string;
  endDate: Nullable<string>;
  isWorking: boolean;
}

/**
 * 멤버 요약 정보 (최소 필드)
 */
export interface MemberSummary {
  id: number;
  name: string;
  profileImageUrl: string;
  tracks: MemberTrack[];
}

/**
 * 멤버 기본 정보 (목록/요약 뷰에서 사용하는 필드)
 */
export interface MemberBase extends MemberSummary {
  university: string;
  registeredAt: string;
  role: MemberRole;
  status: MemberStatus;
  isActive?: boolean;
}

/**
 * 멤버 상세 정보 (상세/관리 화면에서 사용하는 확장 필드)
 */
export interface MemberDetail extends MemberBase {
  email: string;
  phoneNumber: string;
  link: Nullable<string>;
  graduateSchool: Nullable<string>;
  activityScore: number;
  isActive: boolean;
  careers: Career[];
}

/**
 * 멤버 상세 도메인 모델 (요약 + 상세 정보)
 */
export type Member = MemberDetail;
