'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import { expelMember } from '../api/expelMember';

type ExpelMembersParams = {
  memberIds: number[];
};

export const useExpelMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, ExpelMembersParams>({
    mutationKey: ['member', 'expel'],
    mutationFn: async ({ memberIds }) => {
      await Promise.all(memberIds.map((memberId) => expelMember(memberId)));
      return null;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: memberQueryKeys.all });
    },
    onError: (error) => {
      console.error('[Members Expel Error]', error.message);
    },
  });
};
