import { normalizeTextNullable } from './normalize';
import type {
  CareerDTO,
  UserProfile,
  UserLevel,
  ServerUserLevel,
  DateString,
  TrackPart,
} from './types';
import type { UserProfileApiResponse } from '@/entities/user/api/types';

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

export function isTrackPart(part: string): part is TrackPart {
  return Object.prototype.hasOwnProperty.call(toLabelPartMap, part);
}

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

export function mapMemberPartToBatch(memberPart: string): string {
  const map: Record<string, string> = toLabelPartMap;
  const label = map[memberPart];
  return label ?? '미정';
}

export function mapUserProfile(dto: UserProfileApiResponse['data']): UserProfile {
  const primaryTrack = dto.trackList?.[0];
  const bannerPart =
    primaryTrack?.part && isTrackPart(primaryTrack.part) ? primaryTrack.part : null;
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
    chips: dto.trackList.map((t) => {
      const partLabel = isTrackPart(t.part) ? toLabelPartMap[t.part] : t.part;
      return `${t.generation}기 ${partLabel}`;
    }),
    careers,
  };
}
