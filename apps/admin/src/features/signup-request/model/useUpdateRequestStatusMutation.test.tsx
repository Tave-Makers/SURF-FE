import { InfiniteData } from '@tanstack/react-query';
import { renderHook, act, waitFor } from '@testing-library/react';
import { signupRequestQueryKeys } from './queries/signupRequestQueryKeys';
import { useUpdateSignupRequestStatusMutation } from './useUpdateRequestStatusMutation';
import type { SignupRequestMember } from '@/entities/signup-request/model/types';
import type { PageWithContent } from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import { createSignupRequestMember } from '@/test/factories/signupRequest';
import { createTestQueryClient, createTestWrapper } from '@/test/utils/renderWithProviders';

describe('useUpdateSignupRequestStatusMutation', () => {
  test('승인 성공 후 멤버의 가입 상태가 업데이트된다', async () => {
    const queryClient = createTestQueryClient();
    const memberA = createSignupRequestMember({ id: 1, status: 'waiting' });
    const memberB = createSignupRequestMember({ id: 2, status: 'waiting' });

    const seededData: InfiniteData<PageWithContent<SignupRequestMember>, number> = {
      pages: [
        {
          pageNumber: 0,
          pageSize: 20,
          numberOfElements: 2,
          isLast: true,
          content: [memberA, memberB],
        },
      ],
      pageParams: [0],
    };

    queryClient.setQueryData(signupRequestQueryKeys.list({}), seededData);

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(() => useUpdateSignupRequestStatusMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        memberIds: [1],
        nextStatus: 'approve',
        filters: {},
      });
    });

    await waitFor(() => {
      const updated = queryClient.getQueryData<
        InfiniteData<PageWithContent<SignupRequestMember>, number>
      >(signupRequestQueryKeys.list({}));

      expect(updated?.pages[0]?.content[0]?.status).toBe('approve');
      expect(updated?.pages[0]?.content[1]?.status).toBe('waiting');
    });
  });
});
