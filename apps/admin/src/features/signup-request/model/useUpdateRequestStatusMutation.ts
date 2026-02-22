'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Member, MemberBase, MemberStatus } from '@/entities/member/model/types';
import type { CommonResponse } from '@/shared/api/types';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import { updateSignupRequest } from '../api/updateSignupRequest';

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
      //멤버 별 캐시 업데이트 진행
      params.memberIds.forEach((memberId) => {
        //멤버 상세 캐시 업데이트
        queryClient.setQueryData<Member | undefined>(memberQueryKeys.detail(memberId), (data) => {
          if (!data) return data;
          return { ...data, status: params.nextStatus };
        });
        //멤버 기존 정보 캐시 업데이트
        queryClient.setQueryData<MemberBase | undefined>(memberQueryKeys.base(memberId), (data) =>
          data ? { ...data, status: params.nextStatus } : data,
        );
      });

      void queryClient.invalidateQueries({ queryKey: memberQueryKeys.counts() });
    },
    onError: (error) => {
      console.error('[Signup Request Status Update Error]', error.message);
    },
  });
};
