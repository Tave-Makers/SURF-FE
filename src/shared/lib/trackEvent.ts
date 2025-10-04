import * as amplitude from '@amplitude/analytics-browser';
import { AllEventPropsMap } from './types';

// Amplitude 이벤트 전송
export function trackEvent<K extends keyof AllEventPropsMap>(
  eventName: K,
  eventProps?: AllEventPropsMap[K],
) {
  amplitude.logEvent(eventName, eventProps);
}
