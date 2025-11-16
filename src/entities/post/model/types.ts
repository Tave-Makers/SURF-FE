import type { ImageItem } from '@/entities/post/api/types';

export type PostCategory = 'all' | 'event' | 'activity' | 'partnership' | 'release' | 'others';

export type CategoryBadge = Exclude<PostCategory, 'all'>;

export const POST_CATEGORY_LABEL_MAP: Record<PostCategory, string> = {
  all: '전체',
  event: '행사',
  activity: '활동',
  partnership: '제휴',
  release: '패치',
  others: '기타',
};

export const CATEGORY_BADGE_LABEL_MAP: Record<CategoryBadge, string> = {
  event: '행사',
  activity: '활동',
  partnership: '제휴',
  release: '패치',
  others: '기타',
};

export const RESERVATION_LABEL = '예약중';

export type Post = {
  id: number;
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
  category: CategoryBadge;
};
