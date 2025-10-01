// 프로필 API reaponse 원본
export type UserProfileApiResponse = {
  code: number;
  message: string;
  data: {
    username: string;
    phoneNumber: string;
    email: string;
    university: string | null;
    graduateSchool: string | null;
    role: 'SUPER_MANAGER' | 'EXECUTIVE_MANAGER' | 'MANAGER' | 'MEMBER';
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
  };
};

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
