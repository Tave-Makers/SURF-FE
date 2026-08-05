'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dismissMember } from '../api/dismissMember';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';

type DismissMembersParams = {
  memberIds: number[];
};

export const useDismissMemberMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, DismissMembersParams>({
    mutationKey: ['member', 'dismiss'],
    mutationFn: async ({ memberIds }) => {
      await Promise.all(memberIds.map((memberId) => dismissMember(memberId)));
      return null;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: memberQueryKeys.all });
    },
    onError: (error) => {
      console.error('[Members Dismiss Error]', error.message);
    },
  });
};
