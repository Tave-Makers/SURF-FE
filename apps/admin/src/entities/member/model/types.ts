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

/**
 * 멤버 트랙 정보
 */
export interface MemberTrack {
  generation: number; // 기수
  part: TrackPart; // 파트
}

/**
 * 멤버 엔티티 (전체 정보)
 *
 * 멤버 관리, 상세 정보 등에서 사용하는 완전한 멤버 정보입니다.
 *
 * @example
 * const member: Member = {
 *   id: 1,
 *   name: '홍길동',
 *   email: 'hong@example.com',
 *   phoneNumber: '010-1234-5678',
 *   role: 'MEMBER',
 *   university: '서울대학교',
 *   profileImageUrl: 'https://...',
 *   tracks: [{ generation: 15, part: 'BACKEND' }],
 *   registeredAt: new Date('2026-01-20'),
 * };
 */
export interface Member {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  university: string;
  profileImageUrl: string;
  tracks: MemberTrack[];
  registeredAt: string;
}
