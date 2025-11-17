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
  likes: number;
  comments: number;
  boardId: number;
  state?: 'default' | 'reserved';
  thumbnailUrl?: string;
  isReserved?: boolean;
  images?: ImageItemResponse[];
  categoryId?: number | null;
  time?: string;
  hasSchedule?: boolean;
  imageUrlList?: ImageItemResponse[];
};

export type PostDetail = {
  postId: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  time: string;
  boardId: number;
  pinned: boolean;
  hasSchedule: boolean;
  scrappedByMe: boolean;
  scrapCount: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  imageUrlList: ImageItemResponse[];
  categoryId: number | null;
};

export type PostType = 'scraps' | 'my-posts';

export type PostCategory = 'all' | 'event' | 'activity' | 'partnership' | 'release' | 'others';
export type CategoryBadge = Exclude<PostCategory, 'all'>;
