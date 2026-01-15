import { axiosInstance } from '@/shared/lib/axiosInstance';
import { MemberSearchApiResponse, MemberSearchRequestDTO } from './types';

export const memberSearchApi = {
  memberSearch(params: MemberSearchRequestDTO) {
    return axiosInstance.get<MemberSearchApiResponse>('/v1/user/members', {
      params,
    });
  },
};
