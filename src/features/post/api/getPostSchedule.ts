import { axiosInstance } from '@/shared/lib/axiosInstance';
import { PostScheduleResponse } from '@/entities/post/api/types';

/**
 * 게시글 일정 조회
 */

export const getPostSchedule = async (postId: number): Promise<PostScheduleResponse['data']> => {
  try {
    const { data } = await axiosInstance.get<PostScheduleResponse>(
      `/v1/user/post/${postId}/schedule`,
    );
    return data.data;
  } catch (error) {
    console.error('Error fetching post schedule:', error);
    throw error;
  }
};
