import { PostContent } from './types';
import { Post } from '../model/types';

export const transformApiPostToPost = (apiPost: PostContent): Post => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    // pinned 작성 필요
    date: new Date(apiPost.postedAt).toLocaleDateString('ko-KR'), // 날짜 포맷팅
    isLiked: apiPost.likedByMe,
    likeCount: apiPost.likeCount,
    commentCount: apiPost.commentCount,
    writer: apiPost.nickname,
    thumbnailUrl: undefined, // 서버 응답에 없음(임시)
    /* 기본 프론트 Post 타입에 서버 응답으로 오는 
    pinned, boardId, likeByMe, scrappedByMe, scrapCount 도 추가 필요. */
    boardId: apiPost.boardId,
    tags: undefined, // 일단 undefined
  };
};

// API 응답을 Post 배열로 변환
export const transformApiResponseToPosts = (apiResponse: { content: PostContent[] }): Post[] => {
  return apiResponse.content.map(transformApiPostToPost);
};
