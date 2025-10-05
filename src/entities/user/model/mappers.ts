import type { UserProfileApiResponse } from '@/entities/user/api/types';
import type { YearMonth, CareerDTO } from './types';

export type BannerPart = 'frontend' | 'backend' | 'design' | 'data-analysis' | 'deep-learning';
export type UserLevel = 'superManager' | 'executiveManager' | 'manager' | 'member';

export type UserProfile = {
  name: string;
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

export function mapUserLevel(role: UserProfileApiResponse['data']['role']): UserLevel {
  switch (role) {
    case 'SUPER_MANAGER':
      return 'superManager';
    case 'EXECUTIVE_MANAGER':
      return 'executiveManager';
    case 'MANAGER':
      return 'manager';
    default:
      return 'member';
  }
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

export function mapUserProfile(dto: UserProfileApiResponse['data']): UserProfile {
  const primaryTrack = dto.trackList?.[0];
  const bannerPart = primaryTrack?.part ? mapPartToBanner(primaryTrack.part) : null;

  return {
    name: dto.username,
    phoneNumber: dto.phoneNumber,
    email: dto.email,
    university: dto.university,
    graduateSchool: dto.graduateSchool,
    level: mapUserLevel(dto.role),
    activityScore: dto.activityScore,
    isActive: dto.isActive,
    bannerPart,
    chips: dto.trackList.map((t) => `${t.generation}기 ${t.part}`),
    careers: dto.careerList.map((c) => ({
      careerId: c.careerId,
      companyName: c.companyName,
      position: c.position,
      startDate: c.startDate as YearMonth,
      endDate: (c.endDate ?? null) as YearMonth | null,
      isWorking: c.isWorking,
    })),
  };
}
