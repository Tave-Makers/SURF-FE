import { TrackPart, UserLevel } from '@/entities/user/model/types';

export interface MemberSearchItem {
  userId: number;
  name: string;
  university: string;
  bio: string | null;
  avatarUrl: string | null;
  level: UserLevel;
  chips: string[];
  isBlocked: boolean;
}

export interface MemberSearchFilters {
  keyword: string; // UI용
  debouncedKeyword: string; // API용
  generation: number | undefined;
  part: TrackPart | undefined;
}
