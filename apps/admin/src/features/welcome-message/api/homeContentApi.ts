import { axiosInstance } from '@/shared/lib/axiosInstance';
import {
  HomeContentResDto,
  HomeContentResponse,
  UpdateHomeContentRequest,
} from '@/features/welcome-message/api/types';

export const homeContentApi = {
  getHomeContent: async (): Promise<HomeContentResDto> => {
    const res = await axiosInstance.get<HomeContentResponse>('/v1/admin/home/content');
    return res.data.data;
  },
  updateHomeContent: async (body: UpdateHomeContentRequest): Promise<HomeContentResDto> => {
    const res = await axiosInstance.put<HomeContentResponse>('/v1/admin/home/content', body);
    return res.data.data;
  },
};
