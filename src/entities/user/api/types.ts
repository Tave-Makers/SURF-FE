import type { CommonResponse } from '@/shared/api/types';
import type { ServerUserLevel } from '../model/types';

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

// 활동뱃지
export type BadgeItemDTO = {
  badgeName: string;
  generation: number;
  awardedAt: string;
};

export type BadgePageDTO = {
  content: BadgeItemDTO[];
  pageNumber: number;
  pageSize: number;
  numberOfElements: number;
  isLast: boolean;
};

export type BadgeApiResponse = CommonResponse<BadgePageDTO>;
