import { PostListItemResponse, PostDetailData } from '@/entities/post/api/types';
import { Post } from '@/entities/post/model/types';
import {
  POST_CATEGORIES,
  PostCategoryLabel,
  TabCategoryId,
  TAB_CATEGORIES,
  TabCategoryLabel,
} from './constants';

// categoryId - Category Label 변환
export const categoryIdToLabel = (id: number | string | null | undefined): PostCategoryLabel => {
  if (id === 'all' || id == null) return '기타';

  const found = POST_CATEGORIES.find((c) => c.id === id);
  return found?.label ?? '기타';
};

export const tabCategoryToServerId = (label: TabCategoryLabel): TabCategoryId => {
  const found = TAB_CATEGORIES.find((c) => c.label === label);
  return found?.id ?? 'all';
};

// 목록 API 변환
export const transformListItemToPost = (item: PostListItemResponse): Post => {
  return {
    postId: item.id,
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
    images: undefined,
    categoryName: categoryIdToLabel(item.categoryId ?? undefined),
  };
};

// 게시글 상세 API 변환
export const transformDetailToPost = (item: PostDetailData): Post => {
  return {
    postId: item.postId,
    title: item.title,
    content: item.content,
    writer: item.nickname,
    date: item.postedAt,
    pinned: item.pinned,
    isReserved: false,
    boardId: item.boardId,
    likeCount: item.likeCount,
    isLiked: item.likedByMe,
    scrappedByMe: item.scrappedByMe,
    scrapCount: item.scrapCount,
    commentCount: item.commentCount,
    images: item.imageUrlList,
    thumbnailUrl: item.imageUrlList?.[0]?.originalUrl,
    categoryName: categoryIdToLabel(item.categoryId ?? undefined),
  };
};
