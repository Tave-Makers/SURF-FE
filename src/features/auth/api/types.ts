import { UserLevel } from '@/entities/user/model/types';

export const MEMBER_STATUS = {
  REGISTERING: 'REGISTERING', // 가입중
  WAITING: 'WAITING', // 대기중
  APPROVED: 'APPROVED', // 승인됨
  REJECTED: 'REJECTED', // 거절됨
} as const;

export type MemberStatusType = keyof typeof MEMBER_STATUS;

// 온보딩 필요 여부 응답
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

// 카카오로그인 회원 정보 응답
export type KakaoLoginResponse = {
  status: number;
  message: string;
  data: {
    accessToken: string;
    nickname: string;
    email: string;
    profileImageUrl: string;
  };
};
