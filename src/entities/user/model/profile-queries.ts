'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyProfile, updateMyProfile } from '@/entities/user/api/profile';
import { mapUserProfile } from './mappers';
import type { UpdateProfileRequestDTO } from './types';
import { handleApiError } from '@/shared/lib/handleApiError';
import type { UserProfile } from './mappers';

export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
};

export function useMyProfileQuery() {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async (): Promise<UserProfile> => {
      try {
        const { data } = await getMyProfile();
        return mapUserProfile(data);
      } catch (e) {
        throw handleApiError(e, '프로필 조회에 실패했습니다.');
      }
    },
    refetchOnMount: false, // 마운트해도 리페치 X
    refetchOnReconnect: false, // 네트워크 재연결 시 리페치 X
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateProfileRequestDTO): Promise<void> => {
      try {
        await updateMyProfile(payload);
      } catch (e) {
        throw handleApiError(e, '프로필 저장에 실패했습니다.');
      }
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}
