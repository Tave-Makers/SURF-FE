// API 공통 응답 형식
import { CommonResponse } from '@/shared/api/types';

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

// 게시글 목록
export type PostListItemResponse = {
  postId: number;
  categoryId?: number;
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
  thumbnailImageUrl: string | null;
  isReserved: boolean;
  viewCount: number;
};

// 게시물 관련 API 응답 전체 타입
export type PostListApiResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  content: PostListItemResponse[];
  number: number;
  sort: PostSort;
  pageable: Pageable;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
};

export type FullPostListResponse = CommonResponse<PostListApiResponse>;

// 게시글 상세 데이터 타입
export type PostDetailData = {
  postId: number;
  title: string;
  content: string;
  pinned: boolean;
  postedAt: string;
  boardId: number;
  categoryId: number;
  scrappedByMe: boolean;
  scrapCount: number;
  likedByMe: boolean;
  likeCount: number;
  commentCount: number;
  nickname: string;
  isMine: boolean;
  imageUrlList: ImageItemResponse[];
  viewCount: number;
  hasSchedule: boolean;
  profileImageUrl?: string;
};

// 상세 API 응답 타입
export type PostDetailResponse = CommonResponse<PostDetailData>;

// 특정 게시글의 일정
export type PostScheduleData = {
  scheduleId: number;
  category: string;
  title: string;
  startAt: string;
  endAt: string;
  location: string;
  mappedByPost: boolean;
  postId: number;
};
export type PostScheduleResponse = CommonResponse<PostScheduleData>;

export type PostSort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  sort: PostSort;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
};

export type PostApiRequest = {
  page: number;
  size: number;
  sort: string;
};

export type GetBoardPostsRequest = {
  boardId: number;
  category?: string;
  page: number;
  size: number;
  sort?: string;
};

export type CreatePostRequest = {
  boardId: number;
  categoryId: number;
  title: string;
  content: string;
  pinned: boolean;
  reservedAt?: string;
  imageUrlList?: ImageItem[];
  reserved: boolean;
};

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
