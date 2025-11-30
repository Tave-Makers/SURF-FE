import type { ImageItem } from '@/entities/post/api/types';
import { PostCategoryLabel } from './category';

export type Post = {
  postId: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  pinned: boolean;
  isReserved: boolean;
  boardId: number | null;
  likeCount: number;
  isLiked: boolean;
  scrappedByMe: boolean;
  scrapCount: number;
  commentCount: number;
  thumbnailUrl?: string;
  images?: ImageItem[];
  categoryName: PostCategoryLabel;
};
