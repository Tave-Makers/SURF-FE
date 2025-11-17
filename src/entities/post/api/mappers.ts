import { PostContent } from './types';
import { Post } from '../model/types';

export const transformApiPostToPost = (apiPost: PostContent): Post => {
  return {
    postId: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    // pinned 작성 필요
    date: new Date(apiPost.postedAt).toLocaleDateString('ko-KR'), // 날짜 포맷팅
    likeCount: apiPost.likeCount,
    commentCount: apiPost.commentCount,
    writer: apiPost.nickname,
    thumbnailUrl: undefined, // 서버 응답에 없음(임시)
    /* 기본 프론트 Post 타입에 서버 응답으로 오는 
    pinned, boardId, likeByMe, scrappedByMe, scrapCount 도 추가 필요. */
    boardId: apiPost.boardId,
    state: apiPost.pinned ? 'reserved' : 'default', // 일단 pinned 상태에 따라 state 상태 설정되도록 임시적으로 설정
  };
};

// API 응답을 Post 배열로 변환
export const transformApiResponseToPosts = (apiResponse: { content: PostContent[] }): Post[] => {
  return apiResponse.content.map(transformApiPostToPost);
};
