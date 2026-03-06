import type { SignupRequestMember } from '@/entities/signup-request/model/types';
import type {
  SignupRequestListResponse,
  SignupRequestItem,
} from '@/features/signup-request/api/types';

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
    role: 'MEMBER',
    ...overrides,
  };
}

/**
 * Mock 가입 신청 목록 아이템 생성
 */
function createMockSignupRequestItem(index: number): SignupRequestItem {
  return {
    memberId: index,
    username: `테스트유저${index}`,
    university: '테스트대학교',
    profileImageUrl: 'https://example.com/profile.png',
    trackList: [{ generation: 15, part: 'BACKEND' }],
    createdAt: '2026-01-20T10:00:00.000Z',
    memberStatus: 'WAITING',
    role: 'MEMBER',
  };
}

/**
 * Mock 가입 신청 목록 응답 생성
 */
export function createMockSignupRequestList(
  pageNum: number,
  pageSize: number,
  keyword?: string,
): SignupRequestListResponse {
  const totalElements = keyword ? 5 : 40;
  const totalPages = Math.ceil(totalElements / pageSize);
  const isLast = pageNum >= totalPages - 1;

  const startIndex = pageNum * pageSize + 1;
  const itemCount = isLast ? Math.max(0, totalElements - pageNum * pageSize) : pageSize;

  const content = Array.from({ length: itemCount }, (_, i) =>
    createMockSignupRequestItem(startIndex + i),
  );

  return {
    code: 200,
    message: 'SUCCESS',
    data: {
      content,
      pageNumber: pageNum,
      pageSize,
      numberOfElements: content.length,
      isLast,
    },
  };
}
