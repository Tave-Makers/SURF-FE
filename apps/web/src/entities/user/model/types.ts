export type YearMonth = `${number}-${number}`;
export type DateString = `${number}-${number}-${number}`;

export type TrackPart =
  | 'BACKEND'
  | 'WEB_FRONTEND'
  | 'APP_FRONTEND'
  | 'DESIGN'
  | 'DATA_ANALYSIS'
  | 'DEEP_LEARNING';

export const SERVER_USER_LEVELS = ['ADMIN', 'PRESIDENT', 'MANAGER', 'MEMBER'] as const;
export type ServerUserLevel = (typeof SERVER_USER_LEVELS)[number];

export const USER_LEVELS = ['admin', 'president', 'manager', 'member'] as const;
export type UserLevel = (typeof USER_LEVELS)[number];

export interface CareerBase {
  companyName: string;
  position: string;
  startDate: DateString;
  endDate?: DateString | null;
  isWorking?: boolean;
}

export type CareerDTO = CareerBase & { careerId: number };
export type CareerCreateDTO = CareerBase;
export type CareerUpdateDTO = Partial<CareerBase> & { careerId: number };

export interface UserProfile {
  username: string;
  selfIntroduction: string;
  link: string | null;
  profileImgUrl: string;
  phoneNumber: string;
  phoneNumberPublic: boolean;
  email: string;
  university: string | null;
  graduateSchool: string | null;
  level: UserLevel;
  activityScore: number;
  isActive: boolean;
  bannerPart: TrackPart | null;
  chips: string[];
  careers: CareerDTO[];
}

export interface UpdateProfileRequestDTO {
  email?: string;
  university?: string;
  graduateSchool?: string | null;
  selfIntroduction?: string;
  link?: string | null;
  phoneNumber?: string;
  phoneNumberPublic?: boolean;
  profileImageUrl?: string;
  isProfileImageChanged?: boolean;
  careersToCreate?: CareerCreateDTO[] | null;
  careersToUpdate?: CareerUpdateDTO[] | null;
  careerIdsToDelete?: number[] | null;
}
