import { ImageItemResponse } from '../api/types';
import { POST_BOARDS } from './board';
import { PostCategoryLabel } from './category';

export type PostBadgeProps = {
  id: number | string;
  variation: 'event' | 'reservation';
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
  scheduleId: number | null;
  profileImageUrl?: string;
  postedAt: string;
};

// 게시판
export type BoardId = (typeof POST_BOARDS)[number]['id'];
export type BoardLabel = (typeof POST_BOARDS)[number]['label'];

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
  categoryName: PostCategoryLabel;
};
