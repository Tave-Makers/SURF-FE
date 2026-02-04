import type { SignupRequestMember } from '@/entities/signup-request/model/types';

export function createSignupRequestMember(
  overrides: Partial<SignupRequestMember> = {},
): SignupRequestMember {
  return {
    id: 1,
    name: '홍길동',
    university: '서울대학교',
    profileImageUrl: 'https://example.com/profile.png',
    tracks: [{ generation: 15, part: 'BACKEND' }],
    registeredAt: '2026-01-20T10:00:00.000Z',
    status: 'waiting',
    ...overrides,
  };
}
