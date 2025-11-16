import { parseDateTime } from '@/shared/lib/parseDateTime';
import { PostDetailData } from '../api/types';
import { Post } from '../model/types';

/**
 * 게시글 상세 API 데이터를 Post UI 데이터로 변환
 */
export const transformDetailToPost = (item: PostDetailData): Post => {
  const { date, time } = parseDateTime(item.postedAt);

  return {
    postId: item.id,
    title: item.title,
    content: item.content,
    date,
    time,
    pinned: item.pinned,
    boardId: item.boardId,
    scrappedByMe: item.scrappedByMe,
    scrapCount: item.scrapCount,
    likedByMe: item.likedByMe,
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    writer: item.nickname,
    imageUrlList: item.imageUrlList,
    hasSchedule: item.hasSchedule,

    // 백엔드 추가 시 반영 예정
    categoryId: null,
  };
};
