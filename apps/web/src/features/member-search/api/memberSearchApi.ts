import { axiosInstance } from '@/shared/lib/axiosInstance';
import {
  GenerationListResDTO,
  GenerationListResponse,
  MemberSearchApiResponse,
  MemberSearchRequestDTO,
  MemberSearchResponse,
} from './types';

export const memberSearchApi = {
  async memberSearch(params: MemberSearchRequestDTO): Promise<MemberSearchResponse> {
    const response = await axiosInstance.get<MemberSearchApiResponse>('/v1/user/members', {
      params,
    });
    return response.data.data;
  },
  async getGenerationList(): Promise<GenerationListResDTO> {
    const response = await axiosInstance.get<GenerationListResponse>('/v1/user/generations');
    return response.data.data;
  },
};
