import { GetPostLikesResponse, LikedUser } from '@/entities/post/api/types';
import { CommonResponse } from '@/shared/api/types';
import { axiosInstance } from '@/shared/lib/axiosInstance';

export async function getPostLikes(postId: number): Promise<LikedUser[]> {
  const res = await axiosInstance.get<CommonResponse<GetPostLikesResponse>>(
    `/v1/user/posts/${postId}/like`,
  );

  return res.data.data.likes;
}
