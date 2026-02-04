import { http, HttpResponse } from 'msw';
import { createMockSignupRequestList } from '@/features/signup-request/api/mockData';

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

  http.get('/api/proxy/__msw_smoke', () => {
    return HttpResponse.json({ ok: true }, { status: 200 });
  }),
];
