import { CommonResponse } from '@/shared/api/types';

export const SERVER_USER_LEVELS = ['ADMIN', 'PRESIDENT', 'MANAGER'] as const;
export type ServerUserLevel = (typeof SERVER_USER_LEVELS)[number];

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginDTO {
  accessToken: string;
  username: string;
  role: ServerUserLevel;
}

export type LoginResponse = CommonResponse<LoginDTO>;
