import { PostListItemResponse } from '@/entities/post/api/types';
import { TAB_CATEGORIES, TabCategoryLabel, TabCategoryKey } from '@/entities/post/model/tab';
import { categoryIdToLabel } from './category';
import type { Post } from './types';

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
