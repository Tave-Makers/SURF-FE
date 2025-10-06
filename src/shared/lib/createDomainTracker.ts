import { trackEvent } from './trackEvent';

/**
 * 도메인별 트래킹 함수를 생성하는 팩토리
 */
export function createDomainTracker<const M extends Record<string, Record<string, unknown>>>(): <
  K extends keyof M,
>(
  eventName: K,
  eventProps: M[K],
) => ReturnType<typeof trackEvent> {
  return function <K extends keyof M>(
    eventName: K,
    eventProps: M[K],
  ): ReturnType<typeof trackEvent> {
    return trackEvent<M, K>(eventName, eventProps);
  };
}
