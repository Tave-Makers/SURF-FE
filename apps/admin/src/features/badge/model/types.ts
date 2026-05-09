import type { MemberTrack } from '@/entities/member/model/types';

export interface CreateBadgeInput {
  name: string;
  imageUrl: string;
}

export interface BadgeAwardedMember {
  id: number;
  name: string;
  profileImageUrl: string;
  tracks: MemberTrack[];
  awardedAt: string;
}

/**
 * 배지 수정 화면에서 관리하는 폼 상태.
 *
 * 서버의 Badge 도메인 값에 더해 새 이미지 파일과 회수 예정 멤버 ID 목록을 함께 보관한다.
 */
export interface BadgeEditFormData {
  name: string;
  imageUrl: string;
  imageFile: File | null;
  removedMemberIds: number[];
}
