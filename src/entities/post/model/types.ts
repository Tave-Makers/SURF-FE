import type { ImageItem } from '@/entities/post/api/types';
import { POST_BOARDS, POST_CATEGORIES, TAB_CATEGORIES } from './constants';

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

// 게시판
export type BoardId = (typeof POST_BOARDS)[number]['id'];
export type BoardLabel = (typeof POST_BOARDS)[number]['label'];

// 게시글
export type PostCategoryId = (typeof POST_CATEGORIES)[number]['id'];
export type PostCategoryLabel = (typeof POST_CATEGORIES)[number]['label'];

// 탭
export type TabCategoryId = (typeof TAB_CATEGORIES)[number]['id'];
export type TabCategoryLabel = (typeof TAB_CATEGORIES)[number]['label'];
