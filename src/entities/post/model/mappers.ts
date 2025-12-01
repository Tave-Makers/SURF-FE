import { PostDetailData, PostListItemResponse } from '@/entities/post/api/types';
import { TAB_CATEGORIES, TabCategoryLabel, TabCategoryKey } from '@/entities/post/model/tab';
import { categoryIdToLabel } from './category';
import type { Post, PostDetail } from './types';
import { parseDateTime } from '@/shared/lib/parseDateTime';
import { POST_BOARDS } from './board';

export const transformListItemToPost = (item: PostListItemResponse): Post => ({
  postId: item.postId,
  title: item.title,
  content: item.content,
  writer: item.nickname,
  date: item.postedAt,
  pinned: item.pinned,
  isReserved: item.isReserved,
  boardId: item.boardId,
  likeCount: item.likeCount,
  isLiked: item.likedByMe,
  scrappedByMe: item.scrappedByMe,
  scrapCount: item.scrapCount,
  commentCount: item.commentCount,
  thumbnailUrl: item.thumbnailImageUrl ?? undefined,
  categoryName: categoryIdToLabel(item.categoryId),
});

export const tabKeyToLabel = (key: string): TabCategoryLabel => {
  if (key in TAB_CATEGORIES) {
    return TAB_CATEGORIES[key as TabCategoryKey].label;
  }
  return TAB_CATEGORIES.all.label;
};

export const boardIdToLabel = (id: number | null) => {
  if (id === null) return null;
  return POST_BOARDS.find((b) => b.id === id)?.label ?? null;
};

export const boardLabelToId = (label: string) => {
  return POST_BOARDS.find((b) => b.label === label)?.id ?? null;
};

// 게시글 상세 API 변환
export const transformDetailToPost = (item: PostDetailData): PostDetail => {
  const { date, time } = parseDateTime(item.postedAt);

  return {
    postId: item.postId,
    title: item.title,
    content: item.content,
    date,
    time,
    pinned: item.pinned,
    boardId: item.boardId,
    boardLabel: boardIdToLabel(item.boardId),
    scrappedByMe: item.scrappedByMe,
    scrapCount: item.scrapCount,
    likedByMe: item.likedByMe,
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    writer: item.nickname,
    imageUrlList: item.imageUrlList,
    hasSchedule: item.hasSchedule,
    categoryId: item.categoryId,
    categoryLabel: categoryIdToLabel(item.categoryId),
    viewCount: item.viewCount,
    isMine: item.isMine,
  };
};
