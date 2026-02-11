'use client';

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SignupRequestMember } from '@/entities/signup-request/model/types';
import type { PageWithContent } from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import type { CommonResponse } from '@/shared/api/types';
import { signupRequestQueryKeys } from './queries/signupRequestQueryKeys';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import { updateSignupRequest } from '../api/updateSignupRequest';
import { MemberStatus } from '@/entities/member/model/types';

type UpdateSignupRequestStatusParams = {
  memberIds: number[];
  nextStatus: MemberStatus;
};

export const useUpdateSignupRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommonResponse<null>, Error, UpdateSignupRequestStatusParams>({
    mutationKey: ['signup-request', 'update'],
    mutationFn: (params) => updateSignupRequest(params.memberIds, params.nextStatus),
    onSuccess: (_data, params) => {
      const idSet = new Set(params.memberIds);
      queryClient.setQueriesData<InfiniteData<PageWithContent<SignupRequestMember>, number>>(
        { queryKey: signupRequestQueryKeys.lists() },
        (data) => {
          if (!data) {
            return data;
          }

          return {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              content: page.content.map((member) =>
                idSet.has(member.id) ? { ...member, status: params.nextStatus } : member,
              ),
            })),
          };
        },
      );

      params.memberIds.forEach((memberId) => {
        void queryClient.invalidateQueries({ queryKey: memberQueryKeys.detail(memberId) });
      });
    },
    onError: (error) => {
      console.error('[Signup Request Status Update Error]', error.message);
    },
  });
};
