import type { ServerUserLevel } from '../model/types';
import type { CommonResponse } from '@/shared/api/types';

// 프로필 API response 원본
export type UserProfileApiResponse = CommonResponse<{
  username: string;
  profileImageUrl: string;
  phoneNumber: string;
  phoneNumberPublic: boolean;
  selfIntroduction: string | null;
  link: string | null;
  email: string;
  university: string | null;
  graduateSchool: string | null;
  role: ServerUserLevel;
  activityScore: number;
  isActive: boolean;
  trackList: Array<{ generation: number; part: string }>;
  careerList: Array<{
    careerId: number;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string | null;
    isWorking: boolean;
  }>;
}>;

// 활동 배지
export type BadgeItemDTO = {
  badgeId: number;
  badgeName: string;
  badgeImageUrl: string;
  description: string;
  awardedAt: string;
};

export type BadgeApiResponse = CommonResponse<BadgeItemDTO[]>;
