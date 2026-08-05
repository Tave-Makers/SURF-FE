import { ActivityScoreEventPropsMap } from '@/features/activity-score/model/types';
import { AuthEventPropsMap } from '@/features/auth/model/types';

// 모든 도메인의 이벤트 맵 통합
export type AllEventPropsMap = AuthEventPropsMap & ActivityScoreEventPropsMap;
// export type AllEventPropsMap =
// AuthEventPropsMap & OnboardingEventPropsMap;
