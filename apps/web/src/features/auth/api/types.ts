import { UserLevel } from '@/entities/user/model/types';

export const MEMBER_STATUS = {
  REGISTERING: 'REGISTERING',
  WAITING: 'WAITING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type MemberStatusType = (typeof MEMBER_STATUS)[keyof typeof MEMBER_STATUS];

export type ValidStatusResponse = {
  code: number;
  message: string;
  data: {
    memberId: number;
    needOnboarding: boolean;
    memberStatus: MemberStatusType;
    memberRole: UserLevel;
  };
};

export type OAuthLoginData = {
  nickname: string;
  email: string;
  profileImageUrl: string;
};

export type KakaoLoginData = OAuthLoginData & {
  accessToken: string;
};

export type KakaoLoginResponse =
  | {
      status: number;
      message: string;
      data: KakaoLoginData;
    }
  | KakaoLoginData;
