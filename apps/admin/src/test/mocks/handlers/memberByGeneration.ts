import { http, HttpResponse } from 'msw';

const TOTAL_MEMBERS_PER_GENERATION = 20;

function createGenerationMembers(generation: number) {
  return Array.from({ length: TOTAL_MEMBERS_PER_GENERATION }, (_, index) => {
    const memberNumber = index + 1;

    return {
      memberId: generation * 1000 + memberNumber,
      username: `${generation}기멤버${memberNumber}`,
      profileImageUrl: '',
      university: 'TEST_UNIV',
      role: 'MEMBER' as const,
      createdAt: '2026-01-01',
      memberStatus: 'APPROVED',
      trackList: [],
    };
  });
}

export const memberByGenerationHandlers = [
  http.get('/api/proxy/v1/manager/approved-members', ({ request }) => {
    const url = new URL(request.url);
    const generation = Number(url.searchParams.get('generation') ?? 0);
    const pageNum = Number(url.searchParams.get('pageNum') ?? 0);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 5);
    const keyword = (url.searchParams.get('keyword') ?? '').trim();

    const members = createGenerationMembers(generation);
    const filteredMembers = keyword
      ? members.filter((member) => member.username.includes(keyword))
      : members;

    const start = pageNum * pageSize;
    const end = start + pageSize;
    const content = filteredMembers.slice(start, end);
    const isLast = end >= filteredMembers.length;

    return HttpResponse.json(
      {
        code: 200,
        message: 'SUCCESS',
        data: {
          pageNumber: pageNum,
          pageSize,
          numberOfElements: content.length,
          isLast,
          content,
        },
      },
      { status: 200 },
    );
  }),
];
