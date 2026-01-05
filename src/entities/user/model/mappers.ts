import type { UserProfileApiResponse } from '@/entities/user/api/types';
import type {
  CareerDTO,
  UserProfile,
  BannerPart,
  UserLevel,
  ServerUserLevel,
  DateString,
  TrackPart,
} from './types';
import { normalizeTextNullable } from './normalize';

// 한글 → 백엔드 enum
export const toEnumPartMap: Record<string, TrackPart> = {
  백엔드: 'BACKEND',
  '웹 프론트엔드': 'WEB_FRONTEND',
  '앱 프론트엔드': 'APP_FRONTEND',
  디자인: 'DESIGN',
  '데이터 분석': 'DATA_ANALYSIS',
  딥러닝: 'DEEP_LEARNING',
};

// 백엔드 enum → 한글
export const toLabelPartMap: Record<TrackPart, string> = {
  BACKEND: '백엔드',
  WEB_FRONTEND: '웹 프론트엔드',
  APP_FRONTEND: '앱 프론트엔드',
  DESIGN: '디자인',
  DATA_ANALYSIS: '데이터 분석',
  DEEP_LEARNING: '딥러닝',
};

export function mapUserLevel(role: ServerUserLevel | UserLevel): UserLevel {
  const map: Record<ServerUserLevel, UserLevel> = {
    ADMIN: 'admin',
    PRESIDENT: 'president',
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
    startDate: c.startDate as DateString,
    endDate: (c.endDate ?? null) as DateString | null,
    isWorking: c.isWorking,
  }));

  return {
    username: dto.username,
    selfIntroduction: normalizeTextNullable(dto.selfIntroduction) ?? '',
    link: normalizeTextNullable(dto.link),
    profileImgUrl: dto.profileImageUrl,
    phoneNumber: dto.phoneNumber,
    phoneNumberPublic: dto.phoneNumberPublic,
    email: dto.email,
    university: dto.university ?? null,
    graduateSchool: dto.graduateSchool ?? null,
    level: mapUserLevel(dto.role),
    activityScore: dto.activityScore,
    isActive: dto.isActive,
    bannerPart,
    chips: dto.trackList.map((t) => `${t.generation}기 ${t.part}`),
    careers,
  };
}
