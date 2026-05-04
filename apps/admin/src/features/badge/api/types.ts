export interface CreateBadgeRequest {
  name: string;
  imageUrl: string;
  description: string;
  requirement: string;
}

export interface BadgeResDto extends CreateBadgeRequest {
  badgeId: number;
}
