import { trackEvent } from '@/shared/lib/trackEvent';
import { ActivityScoreEventPropsMap } from '../model/types';

export function trackActivityScoreEvent<K extends keyof ActivityScoreEventPropsMap>(
  eventName: K,
  eventProps: ActivityScoreEventPropsMap[K],
) {
  trackEvent<ActivityScoreEventPropsMap, K>(eventName, eventProps);
}
