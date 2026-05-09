import { Badge } from '@/entities/badge/model/types';
import { toMemberTrack } from '@/entities/member/model/mapper';
import { BadgeAwardedMemberResDto, BadgeResDto, CreateBadgeRequest } from '../api/types';
import { BadgeAwardedMember, CreateBadgeInput } from './types';

/**
 * 배지 응답 DTO를 공통 Badge 도메인 모델로 변환한다.
 */
export const mapBadgeResDtoToBadge = (dto: BadgeResDto): Badge => ({
  id: dto.badgeId,
  name: dto.name,
  imageUrl: dto.imageUrl,
});

/**
 * 배지 생성 폼 입력값을 생성 API 요청 바디로 변환한다.
 */
export const mapCreateBadgeInputToRequest = (input: CreateBadgeInput): CreateBadgeRequest => ({
  name: input.name,
  imageUrl: input.imageUrl,
  description: 'description',
  requirement: 'requirement',
});

/**
 * 배지 부여 멤버 DTO를 상세 화면에서 사용하는 멤버 모델로 변환한다.
 */
export const mapBadgeAwardedMemberResDtoToAwardedMember = (
  dto: BadgeAwardedMemberResDto,
): BadgeAwardedMember => ({
  id: dto.memberId,
  name: dto.username,
  profileImageUrl: dto.profileImageUrl ?? '',
  tracks: (dto.trackList ?? []).map(toMemberTrack),
  awardedAt: dto.awardedAt,
});
