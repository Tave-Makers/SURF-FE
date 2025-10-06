import { trackEvent } from './trackEvent';

/**
 * 도메인별 트래킹 함수를 생성하는 팩토리
 */
export function createDomainTracker<const M extends Record<string, Record<string, unknown>>>() {
  return function <K extends keyof M>(eventName: K, eventProps: M[K]) {
    trackEvent<M, K>(eventName, eventProps);
  };
}
