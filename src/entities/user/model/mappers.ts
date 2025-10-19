import type { UserProfileApiResponse } from '@/entities/user/api/types';
import type { YearMonth, CareerDTO, UserProfile, BannerPart } from './types';

export function mapUserLevel(role: UserProfileApiResponse['data']['role']) {
  switch (role) {
    case 'SUPER_MANAGER':
      return 'superManager' as const;
    case 'EXECUTIVE_MANAGER':
      return 'executiveManager' as const;
    case 'MANAGER':
      return 'manager' as const;
    default:
      return 'member' as const;
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

  const careers: CareerDTO[] = dto.careerList.map((c) => ({
    careerId: c.careerId,
    companyName: c.companyName,
    position: c.position,
    startDate: c.startDate as YearMonth,
    endDate: (c.endDate ?? null) as YearMonth | null,
    isWorking: c.isWorking,
  }));

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
    careers,
  };
}
