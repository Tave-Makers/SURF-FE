export interface MentionResponse {
  memberId: number;
  nickname: string;
}

export interface CommentResponse {
  id: number;
  postId: number;
  rootId: number | null;
  parentId: number | null;
  depth: number;
  content: string;
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
  likeCount: number;
  liked: boolean;
  createdAt: string;
  mentions: MentionResponse[];
}

export interface CommentListResponse {
  comments: CommentResponse[];
  totalCount: number;
  hasNext: boolean;
}

export interface CommentCreateRequest {
  parentId: number | null;
  content: string;
  mentionMemberIds: number[];
}

// 멘션 자동완성 검색 응답
export interface MentionSearchResponse {
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
  firstGeneration: number;
}

// 좋아요 누른 회원 목록
export interface CommentLikeMemberResponse {
  memberId: number;
  nickname: string;
  profileImageUrl?: string;
}
