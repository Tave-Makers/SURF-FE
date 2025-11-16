import { ImageItemResponse } from '../api/types';

export type PostBadgeProps = {
  id: number | string;
  variation: 'event' | 'reservation';
};

export type Post = {
  postId: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  pinned: boolean;
  boardId: number | null;
  likeCount: number;
  likedByMe: boolean;
  scrappedByMe: boolean;
  scrapCount: number;
  commentCount: number;
  thumbnailUrl?: string;
  isReserved?: boolean;
  images?: ImageItemResponse[];
  categoryId: number | null;
  time?: string;
  hasSchedule?: boolean;
  imageUrlList?: ImageItemResponse[];
};

export type PostType = 'scraps' | 'my-posts';

export type PostCategory = 'all' | 'event' | 'activity' | 'partnership' | 'release' | 'others';
export type CategoryBadge = Exclude<PostCategory, 'all'>;
