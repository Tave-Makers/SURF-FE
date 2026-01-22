import { TrackPart } from '@/entities/member/model/types';
import { SignupRequestListResponse } from './types';

/**
 * 가입 신청 목록 목업 데이터 생성
 *
 * @param pageNumber - 페이지 번호
 * @param pageSize - 페이지 크기
 * @param keyword - 검색 키워드
 * @returns 목업 응답 데이터
 */
export function createMockSignupRequestList(
  pageNumber: number,
  pageSize: number,
  keyword?: string,
): SignupRequestListResponse {
  // 전체 목업 데이터 (100개)
  const allMembers = Array.from({ length: 100 }, (_, i) => ({
    memberId: i + 1,
    username: `테스트유저${i + 1}`,
    university: i % 3 === 0 ? '서울대학교' : i % 3 === 1 ? '연세대학교' : '고려대학교',
    profileImageUrl: `https://i.pravatar.cc/150?img=${i + 1}`,
    trackList: [
      {
        generation: 15 + (i % 3),
        part: ['BACKEND', 'WEB_FRONTEND', 'APP_FRONTEND', 'DESIGN', 'DATA_ANALYSIS'][
          i % 5
        ] as TrackPart,
      },
    ],
    createdAt: `2026-01-${String(20 - (i % 20)).padStart(2, '0')}T10:00:00.000Z`, // 고정 날짜
  }));

  // 검색 필터링
  const filteredMembers = keyword
    ? allMembers.filter((member) => member.username.includes(keyword))
    : allMembers;

  // 페이지네이션
  const start = pageNumber * pageSize;
  const end = start + pageSize;
  const paginatedMembers = filteredMembers.slice(start, end);

  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const isLast = pageNumber >= totalPages - 1;

  return {
    code: 200,
    message: 'SUCCESS',
    data: {
      content: paginatedMembers,
      pageNumber,
      pageSize,
      numberOfElements: paginatedMembers.length,
      isLast,
    },
  };
}
