import { AuthEventPropsMap } from '@/features/auth/model/types';
import { ActivityScoreEventPropsMap } from '@/features/activity-score/model/types';

// 모든 도메인의 이벤트 맵 통합
export type AllEventPropsMap = AuthEventPropsMap & ActivityScoreEventPropsMap;
// export type AllEventPropsMap =
// AuthEventPropsMap & OnboardingEventPropsMap;
