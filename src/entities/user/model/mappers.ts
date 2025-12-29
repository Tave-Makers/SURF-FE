import type { UserProfileApiResponse } from '@/entities/user/api/types';
import type {
  YearMonth,
  CareerDTO,
  UserProfile,
  BannerPart,
  UserLevel,
  ServerUserLevel,
} from './types';
import { toLabelPartMap } from '@/features/onboarding/lib/trackMapper';

export function mapUserLevel(role: ServerUserLevel | UserLevel): UserLevel {
  const map: Record<ServerUserLevel, UserLevel> = {
    SUPER_MANAGER: 'superManager',
    EXECUTIVE_MANAGER: 'executiveManager',
    MANAGER: 'manager',
    MEMBER: 'member',
  };
  if (role in map) return map[role as ServerUserLevel];
  return role as UserLevel;
}

export function mapPartToBanner(partKo: string): BannerPart | null {
  const norm = partKo.replace(/\s+/g, '');
  const partMap: Record<string, BannerPart> = {
    웹프론트엔드: 'frontend',
    앱프론트엔드: 'frontend',
    백엔드: 'backend',
    디자인: 'design',
    데이터분석: 'data-analysis',
    딥러닝: 'deep-learning',
  };
  return partMap[norm] ?? null;
}

export function mapMemberPartToBatch(memberPart: string): string {
  const map: Record<string, string> = toLabelPartMap;
  const label = map[memberPart];
  return label ?? '미정';
}

export function mapUserProfile(dto: UserProfileApiResponse['data']): UserProfile {
  const primaryTrack = dto.trackList?.[0];
  const bannerPart = primaryTrack?.part ? mapPartToBanner(primaryTrack.part) : null;

  const careers: CareerDTO[] = dto.careerList.map((c) => ({
    careerId: c.careerId,
    companyName: c.companyName,
    position: c.position,
    startDate: c.startDate as YearMonth,
    endDate: (c.endDate ?? null) as YearMonth | null,
    isWorking: c.isWorking,
  }));

  return {
    userId: 1, // TODO: API에서 userId 받아오도록 수정 필요
    name: dto.username,
    bio: null, // TODO: API에서 bio 받아오도록 수정 필요
    avatarUrl: null, // TODO: API에서 avatarUrl 받아오도록 수정 필요
    phoneNumber: dto.phoneNumber,
    email: dto.email,
    university: dto.university,
    graduateSchool: dto.graduateSchool,
    level: mapUserLevel(dto.role),
    activityScore: dto.activityScore,
    isActive: dto.isActive,
    bannerPart,
    chips: dto.trackList.map((t) => `${t.generation}기 ${t.part}`),
    careers,
  };
}
