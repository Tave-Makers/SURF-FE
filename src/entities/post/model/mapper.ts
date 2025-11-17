import { PostDetailData } from '../api/types';
import { POST_CATEGORIES, PostCategoryLabel } from './constants';
import { Post } from './types';

// 숫자 -> 라벨
export const categoryIdToLabel = (id: number | null | undefined): PostCategoryLabel => {
  const found = POST_CATEGORIES.find((c) => c.id === id);
  return found?.label ?? '기타';
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
    category: categoryIdToLabel(item.categoryId),
  };
};
