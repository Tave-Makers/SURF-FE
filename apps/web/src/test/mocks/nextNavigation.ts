import { vi } from 'vitest';

let mockPathname = '/';
let mockParams: Record<string, string> = {};

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => mockPathname,
  useParams: () => mockParams,
  useSearchParams: () => new URLSearchParams(),
}));

export const setMockPathname = (pathname: string) => {
  mockPathname = pathname;
};

export const setMockParams = (params: Record<string, string>) => {
  mockParams = params;
};

export const resetMockNavigation = () => {
  mockPathname = '/';
  mockParams = {};
};
