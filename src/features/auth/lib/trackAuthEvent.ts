import { trackEvent } from '@/shared/lib/trackEvent';
import { AuthEventPropsMap } from '../model/types';

export function trackAuthEvent<K extends keyof AuthEventPropsMap>(
  eventName: K,
  eventProps: AuthEventPropsMap[K],
) {
  trackEvent<AuthEventPropsMap, K>(eventName, eventProps);
}
