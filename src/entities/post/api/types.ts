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

// 게시물 API 타입
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
