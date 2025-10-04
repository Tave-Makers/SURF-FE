import * as amplitude from '@amplitude/analytics-browser';

export function trackEvent<
  const M extends Record<string, Record<string, unknown>>,
  K extends keyof M,
>(eventName: K, eventProps: M[K]) {
  amplitude.logEvent(String(eventName), eventProps);
}
