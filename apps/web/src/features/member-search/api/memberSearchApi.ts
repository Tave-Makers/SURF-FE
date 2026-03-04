import { axiosInstance } from '@/shared/lib/axiosInstance';
import {
  GenerationListResDTO,
  GenerationListResponse,
  MemberSearchApiResponse,
  MemberSearchRequestDTO,
} from './types';

export const memberSearchApi = {
  memberSearch(params: MemberSearchRequestDTO) {
    return axiosInstance.get<MemberSearchApiResponse>('/v1/user/members', {
      params,
    });
  },
  async getGenerationList(): Promise<GenerationListResDTO> {
    const response = await axiosInstance.get<GenerationListResponse>('/v1/user/generations');
    return response.data.data;
  },
};
