// API 공통 응답 형식
import { CommonResponse } from '@/shared/api/types';

// 응답 Sort
export type PostSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

// 페이지네이션
export type Pageable = {
  offset: number;
  sort: PostSort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
};

export type PostContent = {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  postedAt: string;
  boardId: number;
  scrappedByMe: boolean;
  scrapCount: number;
  likeByMe: boolean;
  likeCount: number;
  commentCount: number;
  nickname: string;
};

// 게시물 관련 API 응답 전체 타입
export type PostApiResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PostContent[];
  number: number;
  sort: PostSort;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

// 게시물 관련 API 응답 전체 타입
export type FullApiResponse = CommonResponse<PostApiResponse>;

// 게시물 API 요청 타입
export type PostApiRequest = {
  page: number;
  size: number;
  sort: string[];
};

/*****************
게시글 상세 관련 타입
******************/

// 게시글 상세 이미지 타입
export type ImageItem = {
  originalUrl: string;
  sequence: number;
};

// 게시글 상세 이미지 응답 타입
export type ImageItemResponse = ImageItem & {
  imageId: number;
  postId: number;
};

// 게시글 상세 데이터 타입
export type PostDetailData = {
  postId: number;
  title: string;
  content: string;
  pinned: boolean;
  postedAt: string;
  boardId: number;
  scrappedByMe: boolean;
  scrapCount: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  nickname: string;
  imageUrlList: ImageItemResponse[];
  hasSchedule: boolean;
};

// 상세 API 응답 타입
export type PostDetailResponse = CommonResponse<PostDetailData>;

// 좋아요 누른 유저 타입
export interface LikedUser {
  id: number;
  name: string;
  profileImageUrl: string;
}

// 게시글 좋아요 누른 유저 API 응답 타입
export interface GetPostLikesResponse {
  likes: LikedUser[];
}
