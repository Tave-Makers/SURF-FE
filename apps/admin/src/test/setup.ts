import '@testing-library/jest-dom/vitest';
import { server } from './mocks/server';

if (!globalThis.ResizeObserver) {
  class ResizeObserverMock implements ResizeObserver {
    observe() {}

    unobserve() {}

    disconnect() {}
  }

  globalThis.ResizeObserver = ResizeObserverMock;
}

if (!globalThis.IntersectionObserver) {
  type IOCallback = IntersectionObserverCallback;

  class IntersectionObserverMock implements IntersectionObserver {
    static instances: IntersectionObserverMock[] = [];

    readonly root = null;
    readonly rootMargin = '';
    readonly thresholds = [];

    private callback: IOCallback;
    private elements = new Set<Element>();

    constructor(callback: IOCallback) {
      this.callback = callback;
      IntersectionObserverMock.instances.push(this);
    }

    observe(target: Element) {
      this.elements.add(target);
    }

    unobserve(target: Element) {
      this.elements.delete(target);
    }

    disconnect() {
      this.elements.clear();
    }

    takeRecords() {
      return [];
    }

    trigger(isIntersecting = true) {
      const entries = Array.from(this.elements).map(
        (target) =>
          ({
            isIntersecting,
            target,
          }) as IntersectionObserverEntry,
      );
      this.callback(entries, this);
    }
  }

  globalThis.IntersectionObserver = IntersectionObserverMock;
  (globalThis as typeof globalThis & { __triggerIntersection?: () => void }).__triggerIntersection =
    () => {
      IntersectionObserverMock.instances.forEach((observer) => observer.trigger(true));
    };
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});
