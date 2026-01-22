'use client';

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SignupRequestMember,
  SignupRequestStatus,
} from '@/entities/signup-request/model/types';
import type { PageWithContent } from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import type { CommonResponse } from '@/shared/api/types';
import {
  signupRequestQueryKeys,
  SignupRequestFilters,
  normalizeSignupRequestFilters,
} from './queries/signupRequestQueryKeys';
import { updateSignupRequest } from '../api/updateSignupRequest';

type UpdateSignupRequestStatusParams = {
  memberIds: number[];
  nextStatus: SignupRequestStatus;
  filters: SignupRequestFilters;
};

export const useUpdateSignupRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommonResponse<null>, Error, UpdateSignupRequestStatusParams>({
    mutationKey: ['signup-request', 'update'],
    mutationFn: (params) => updateSignupRequest(params.memberIds, params.nextStatus),
    onSuccess: (_data, params) => {
      const normalizedFilters = normalizeSignupRequestFilters(params.filters);
      const queryKey = signupRequestQueryKeys.list(normalizedFilters);

      const idSet = new Set(params.memberIds);
      queryClient.setQueryData<InfiniteData<PageWithContent<SignupRequestMember>, number>>(
        queryKey,
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
    },
    onError: (error) => {
      if (error instanceof Error) {
        console.error('[Signup Request Status Update Error]', error.message);
      }
    },
  });
};
