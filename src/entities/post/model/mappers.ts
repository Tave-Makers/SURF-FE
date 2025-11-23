import {
  PostDetailData,
  PostListItemResponse,
  PostMutationResponse,
} from '@/entities/post/api/types';
import { Post, PostDetail } from '@/entities/post/model/types';
import { POST_BOARDS, POST_CATEGORIES, TAB_CATEGORIES } from './constants';
import { PostCategoryLabel, TabCategoryLabel, TabCategoryId } from './types';
import { parseDateTime } from '@/shared/lib/parseDateTime';

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

export const boardIdToLabel = (id: number | null) => {
  if (id === null) return null;
  return POST_BOARDS.find((b) => b.id === id)?.label ?? null;
};

export const boardLabelToId = (label: string) => {
  return POST_BOARDS.find((b) => b.label === label)?.id ?? null;
};

// 목록 API 변환
export const transformListItemToPost = (item: PostListItemResponse): Post => {
  return {
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
    images: undefined,
    categoryName: categoryIdToLabel(item.categoryId ?? undefined),
  };
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

// 게시글 생성/수정 API 변환
export const transformMutationToPost = (item: PostMutationResponse): Post => {
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
    categoryName: categoryIdToLabel(item.categoryId ?? undefined),
  };
};
