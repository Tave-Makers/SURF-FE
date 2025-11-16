import { PostDetailData } from '../api/types';
import { Post, CategoryBadge } from './types';

// categoryId - CategoryBadge 변환
const mapCategoryIdToBadge = (categoryId: number | null | undefined): CategoryBadge => {
  const map: Record<number, CategoryBadge> = {
    1: 'event',
    2: 'activity',
    3: 'partnership',
    4: 'patch',
    5: 'etc',
  };
  return categoryId ? (map[categoryId] ?? 'etc') : 'etc';
};

// 게시글 생성/수정 API 변환
export const transformMutationToPost = (item: PostDetailData): Post => {
  return {
    postId: item.id,
    title: item.title,
    content: item.content,
    writer: item.nickname,
    date: item.postedAt,
    pinned: item.pinned,
    isReserved: false,
    boardId: item.boardId ?? null,
    likeCount: 0,
    isLiked: false,
    scrappedByMe: false,
    scrapCount: 0,
    commentCount: 0,
    images: undefined,
    thumbnailUrl: undefined,
    category: mapCategoryIdToBadge(item.categoryId),
  };
};
