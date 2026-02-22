import { renderHook, act, waitFor } from '@testing-library/react';
import { useUpdateSignupRequestStatusMutation } from './useUpdateRequestStatusMutation';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import type { SignupRequestMember } from '@/entities/signup-request/model/types';
import { createSignupRequestMember } from '@/test/factories/signupRequest';
import { createTestQueryClient, createTestWrapper } from '@/test/utils/renderWithProviders';

describe('useUpdateSignupRequestStatusMutation', () => {
  test('승인 성공 후 멤버의 가입 상태가 업데이트된다', async () => {
    const queryClient = createTestQueryClient();
    const memberA = createSignupRequestMember({ id: 1, status: 'waiting' });
    const memberB = createSignupRequestMember({ id: 2, status: 'waiting' });

    queryClient.setQueryData<SignupRequestMember>(memberQueryKeys.base(memberA.id), memberA);
    queryClient.setQueryData<SignupRequestMember>(memberQueryKeys.base(memberB.id), memberB);

    const wrapper = createTestWrapper(queryClient);
    const { result } = renderHook(() => useUpdateSignupRequestStatusMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync({
        memberIds: [1],
        nextStatus: 'approve',
      });
    });

    await waitFor(() => {
      const updatedA = queryClient.getQueryData<SignupRequestMember>(memberQueryKeys.base(memberA.id));
      const updatedB = queryClient.getQueryData<SignupRequestMember>(memberQueryKeys.base(memberB.id));

      expect(updatedA?.status).toBe('approve');
      expect(updatedB?.status).toBe('waiting');
    });
  });
});
