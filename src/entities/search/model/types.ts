import { UserLevel } from '@/entities/user/model/types';
import { TrackPart } from '@/features/onboarding/model/types';

export interface MemberSearchItem {
  userId: number;
  name: string;
  university: string;
  bio: string | null;
  avatarUrl: string | null;
  level: UserLevel;
  chips: string[];
}

export interface MemberSearchFilters {
  keyword: string;
  generation: number | undefined;
  part: TrackPart | undefined;
}
