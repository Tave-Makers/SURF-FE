import { ImageItem, ImageItemResponse } from '../api/types';
import { POST_BOARDS, POST_CATEGORIES, TAB_CATEGORIES } from './constants';
export type PostType = 'scraps' | 'my-posts';

export type PostCategory = 'all' | 'event' | 'activity' | 'partnership' | 'release' | 'others';
export type CategoryBadge = Exclude<PostCategory, 'all'>;

// 게시판
export type BoardId = (typeof POST_BOARDS)[number]['id'];
export type BoardLabel = (typeof POST_BOARDS)[number]['label'];

// 게시글
export type PostCategoryId = (typeof POST_CATEGORIES)[number]['id'];
export type PostCategoryLabel = (typeof POST_CATEGORIES)[number]['label'];

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

export type PostDetail = {
  postId: number;
  title: string;
  content: string;
  writer: string;
  date: string;
  time: string;
  boardId: number;
  boardLabel: string | null;
  pinned: boolean;
  hasSchedule: boolean;
  scrappedByMe: boolean;
  scrapCount: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  imageUrlList: ImageItemResponse[];
  viewCount: number;
  isMine: boolean;
  categoryId: number;
  categoryLabel: string | null;
};

// 탭
export type TabCategoryId = (typeof TAB_CATEGORIES)[number]['id'];
export type TabCategoryLabel = (typeof TAB_CATEGORIES)[number]['label'];
