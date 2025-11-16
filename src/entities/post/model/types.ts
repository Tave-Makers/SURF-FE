import { ImageItemResponse } from '../api/types';

export type PostCategory = 'all' | 'event' | 'activity' | 'partnership' | 'patch' | 'etc';

export type CategoryBadge = Exclude<PostCategory, 'all'>;

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
  images?: ImageItemResponse[];
  category: CategoryBadge;
};
