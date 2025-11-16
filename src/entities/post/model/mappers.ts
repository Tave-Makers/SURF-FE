import {
  PostListItemResponse,
  PostDetailResponse,
  PostMutationResponse,
} from '@/entities/post/api/types';
import { Post, CategoryBadge } from '@/entities/post/model/types';

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
    category: 'event',
  };
};

// 게시글 상세 API 변환
export const transformDetailToPost = (item: PostDetailResponse): Post => {
  return {
    postId: item.id,
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
    category: mapCategoryIdToBadge(item.categoryId),
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
    category: mapCategoryIdToBadge(item.categoryId),
  };
};
