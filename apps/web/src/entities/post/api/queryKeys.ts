export const postQueryKeys = {
  all: ['post'] as const,

  /* --------------------
   * 공통 레이어 (invalidate용)
   * -------------------- */
  lists: () => [...postQueryKeys.all, 'list'] as const,
  details: () => [...postQueryKeys.all, 'detail'] as const,

  /* --------------------
   * 상세
   * -------------------- */
  detail: (postId: number) => [...postQueryKeys.details(), postId] as const,

  /* --------------------
   * 좋아요
   * -------------------- */

  // 특정 게시글의 좋아요 관련 모든 쿼리 (목록, 개수 등)
  likes: (postId: number) => [...postQueryKeys.detail(postId), 'likes'] as const,

  // 좋아요를 누른 사용자 목록
  likeUsers: (postId: number) => [...postQueryKeys.likes(postId), 'users'] as const,

  /* --------------------
   * 게시판 기준 목록
   * -------------------- */
  board: (boardId: number) => [...postQueryKeys.lists(), 'board', boardId] as const,

  boardPosts: (boardId: number, categoryKey?: string) =>
    [...postQueryKeys.board(boardId), categoryKey ?? 'all'] as const,

  /* --------------------
   * 내 게시글
   * -------------------- */
  myPosts: () => [...postQueryKeys.lists(), 'me'] as const,

  // 내 게시글 일반 페이징용
  myPostsPaging: (page: number, size: number, sort: string) =>
    [...postQueryKeys.myPosts(), 'paging', { page, size, sort }] as const,

  // 내 게시글 무한 스크롤용
  myPostsInfinite: (size: number, sort: string) =>
    [...postQueryKeys.myPosts(), 'infinite', { size, sort }] as const,

  /* --------------------
   * 스크랩한 게시글
   * -------------------- */
  scraps: () => [...postQueryKeys.lists(), 'scraps'] as const,

  // 일반 페이징 목록용
  scrapPaging: (page: number, size: number, sort: string) =>
    [...postQueryKeys.scraps(), 'paging', { page, size, sort }] as const,

  // 무한 스크롤용
  scrapInfinite: (size: number, sort: string) =>
    [...postQueryKeys.scraps(), 'infinite', { size, sort }] as const,
};
