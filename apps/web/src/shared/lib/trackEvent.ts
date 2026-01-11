import * as amplitude from '@amplitude/analytics-browser';

export function trackEvent<
  const M extends Record<string, Record<string, unknown>>,
  K extends keyof M,
>(eventName: K, eventProps: M[K]) {
  try {
    amplitude.logEvent(String(eventName), eventProps);
  } catch (error) {
    console.error(`[Amplitude] ${String(eventName)} 이벤트 전송 실패:`, error);
  }
}
