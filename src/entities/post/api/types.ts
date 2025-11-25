import type { CommonResponse } from '@/shared/api/types';

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

// 게시글 단건 조회
export type PostDetailResponse = {
  id: number;
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
  imageUrlList: ImageItem[];
  categoryId: number | null;
};

export type FullPostDetailResponse = CommonResponse<PostDetailResponse>;

// 게시글 생성/수정
export type PostMutationResponse = {
  id: number;
  title: string;
  content: string;
  pinned: boolean;
  postedAt: string;
  boardId?: number;
  categoryId?: number | null;
  nickname: string;
};

export type FullPostMutationResponse = CommonResponse<PostMutationResponse>;

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
  sort: string[];
};

export type GetBoardPostsRequest = {
  boardId: number;
  category?: string;
  page: number;
  size: number;
  sort?: string;
};
