'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberQueryKeys } from '@/entities/member/model/queries/memberQueryKeys';
import type { Member, MemberBase, MemberRole } from '@/entities/member/model/types';
import { updateMemberRole } from '../api/updateMemberRole';

type UpdateMemberRoleParams = {
  memberId: number;
  role: MemberRole;
};

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<null, Error, UpdateMemberRoleParams>({
    mutationKey: ['member', 'role', 'update'],
    mutationFn: updateMemberRole,
    onSuccess: (_data, params) => {
      //멤버 상세 캐시 업데이트
      queryClient.setQueryData<Member | undefined>(
        memberQueryKeys.detail(params.memberId),
        (data) => {
          if (!data) return data;
          return { ...data, role: params.role };
        },
      );
      //멤버 기존 정보 캐시 업데이트
      queryClient.setQueryData<MemberBase | undefined>(
        memberQueryKeys.base(params.memberId),
        (data) => (data ? { ...data, role: params.role } : data),
      );
    },
    onError: (error) => {
      console.error('[Member Role Update Error]', error.message);
    },
  });
};
