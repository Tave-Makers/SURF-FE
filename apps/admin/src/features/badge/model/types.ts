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
