import { http, HttpResponse } from 'msw';
import { createMockSignupRequestList } from '@/test/factories/signupRequest';

export const signupRequestHandlers = [
  http.get('/api/proxy/v1/manager/registration-list', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = Number(url.searchParams.get('pageNum') ?? 0);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 20);
    const keyword = url.searchParams.get('keyword') ?? undefined;

    const response = createMockSignupRequestList(pageNum, pageSize, keyword);
    return HttpResponse.json(response, { status: 200 });
  }),

  http.patch('/api/proxy/v1/admin/members/:status', () => {
    return HttpResponse.json(
      {
        code: 200,
        message: 'SUCCESS',
        data: null,
      },
      { status: 200 },
    );
  }),

  http.get('/api/proxy/v1/user/members-count', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') ?? '';
    const statuses = [
      ...url.searchParams.getAll('memberStatuses[]'),
      ...url.searchParams.getAll('memberStatuses'),
    ];
    const hasApproved = statuses.includes('APPROVED');

    const membersCount = hasApproved ? (keyword ? 5 : 40) : keyword ? 5 : 40;

    return HttpResponse.json(
      {
        code: 200,
        message: 'SUCCESS',
        data: {
          membersCount,
        },
      },
      { status: 200 },
    );
  }),

  http.get('/api/proxy/__msw_smoke', () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
