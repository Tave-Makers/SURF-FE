import { PostContent } from './types';
import { Post } from '../model/types';

export const transformApiPostToPost = (apiPost: PostContent): Post => {
  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.content,
    writer: '작성자 정보 없음', // 서버 응답에 없음
    date: new Date(apiPost.postedAt).toLocaleDateString('ko-KR'), // 날짜 포맷팅
    likes: apiPost.scrapCount, // 서버 응답에 like 없음 scrapCount를 likes로 임시 매핑
    comments: 0, // 서버 응답에 없음
    thumbnailUrl: undefined, // 서버 응답에 없음
    state: apiPost.pinned ? 'reserved' : 'default', // pinned 상태에 따라 설정? 일단 state 상태도 서버에 없음
  };
};

// API 응답을 Post 배열로 변환
export const transformApiResponseToPosts = (apiResponse: { content: PostContent[] }): Post[] => {
  return apiResponse.content.map(transformApiPostToPost);
};
