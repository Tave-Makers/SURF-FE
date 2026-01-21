'use client';

import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import type {
  SignupRequestMember,
  SignupRequestStatus,
} from '@/entities/signup-request/model/types';
import type { PageWithContent } from '@/shared/lib/tanstack-query/infiniteQueryUtils';
import {
  signupRequestQueryKeys,
  SignupRequestFilters,
  normalizeSignupRequestFilters,
} from './queries/signupRequestQueryKeys';

type UpdateSignupRequestStatusParams = {
  memberIds: number[];
  nextStatus: SignupRequestStatus;
  filters: SignupRequestFilters;
};

export const useUpdateSignupRequestStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdateSignupRequestStatusParams, Error, UpdateSignupRequestStatusParams>({
    mutationKey: ['signup-request', 'update'],
    // TODO: API 연동 시 mutationFn을 실제 요청으로 교체.
    mutationFn: (params) => Promise.resolve(params),
    onSuccess: (params) => {
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
