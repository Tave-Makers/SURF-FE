import { UserLevel } from '@/entities/user/model/types';

export interface MemberSearchItem {
  userId: number;
  name: string;
  university: string;
  bio: string | null;
  avatarUrl: string | null;
  level: UserLevel;
  chips: string[];
}
