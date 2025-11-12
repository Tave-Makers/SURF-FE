import { PostContent } from './types';
import { Post, CategoryBadge } from '../model/types';

// API 응답에 실제로 존재하지만 타입 정의에 없는 필드를 포함한 확장 타입
type ExtendedPostContent = PostContent & {
  categoryId?: number;
  thumbnailImageUrl?: string | null;
};

// categoryId를 CategoryBadge로 변환하는 함수
// TODO: 실제 API와의 매핑 규칙 확인 필요
const mapCategoryIdToBadge = (categoryId: number | undefined): CategoryBadge => {
  if (!categoryId) return 'others';

  const categoryMap: Record<number, CategoryBadge> = {
    1: 'event',
    2: 'activity',
    3: 'partnership',
    4: 'release',
    5: 'others',
  };
  return categoryMap[categoryId] || 'others';
};

export const transformApiPostToPost = (apiPost: ExtendedPostContent): Post => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    date: new Date(apiPost.postedAt).toLocaleDateString('ko-KR'), // 날짜 포맷팅
    likeCount: apiPost.likeCount,
    isLiked: apiPost.likeByMe,
    commentCount: apiPost.commentCount,
    writer: apiPost.nickname,
    thumbnailUrl: apiPost.thumbnailImageUrl || undefined,
    boardId: apiPost.boardId,
    category: mapCategoryIdToBadge(apiPost.categoryId),
    isReserved: apiPost.pinned,
  };
};

// API 응답을 Post 배열로 변환
export const transformApiResponseToPosts = (apiResponse: { content: PostContent[] }): Post[] => {
  return apiResponse.content.map((post) => transformApiPostToPost(post as ExtendedPostContent));
};
