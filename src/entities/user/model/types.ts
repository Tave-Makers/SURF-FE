export type YearMonth = `${number}-${number}`;

export const SERVER_USER_LEVELS = ['ADMIN', 'PRESIDENT', 'MANAGER', 'MEMBER'] as const;
export type ServerUserLevel = (typeof SERVER_USER_LEVELS)[number];

export const USER_LEVELS = ['admin', 'president', 'manager', 'member'] as const;
export type UserLevel = (typeof USER_LEVELS)[number];

export const BANNER_PARTS = [
  'frontend',
  'backend',
  'design',
  'data-analysis',
  'deep-learning',
] as const;
export type BannerPart = (typeof BANNER_PARTS)[number];

export type CareerBase = {
  companyName: string;
  position: string;
  startDate: YearMonth;
  endDate?: YearMonth | null;
  isWorking?: boolean;
};

export type CareerDTO = CareerBase & { careerId: number };
export type CareerCreateDTO = CareerBase;
export type CareerUpdateDTO = Partial<CareerBase> & { careerId: number };

export type UserProfile = {
  userId: number;
  name: string;
  bio: string | null;
  avatarUrl: string | null;
  phoneNumber: string;
  email: string;
  university: string | null;
  graduateSchool: string | null;
  level: UserLevel;
  activityScore: number;
  isActive: boolean;

  bannerPart: BannerPart | null;
  chips: string[];
  careers: CareerDTO[];
};

export type UpdateProfileRequestDTO = {
  phoneNumber?: string;
  phoneNumberPublic?: boolean;
  email?: string;
  careersToCreate?: CareerCreateDTO[];
  careersToUpdate?: CareerUpdateDTO[];
  careerIdsToDelete?: number[];
};
