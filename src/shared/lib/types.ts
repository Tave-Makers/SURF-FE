import { AuthEventPropsMap } from '@/features/auth/model/types';

/**
 * 모든 도메인의 이벤트 맵 통합
 */
export type AllEventPropsMap = AuthEventPropsMap;
// export type AllEventPropsMap =
// AuthEventPropsMap & OnboardingEventPropsMap;

/**
 * 특정 이벤트의 Props 타입 추출
 */
export type ExtractEventProps<E extends keyof AllEventPropsMap> = AllEventPropsMap[E];
