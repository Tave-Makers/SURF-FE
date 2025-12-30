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
   * 게시판 기준 목록
   * -------------------- */
  board: (boardId: number) => [...postQueryKeys.lists(), 'board', boardId] as const,

  boardPosts: (boardId: number, categoryKey?: string) =>
    [...postQueryKeys.board(boardId), categoryKey ?? 'all'] as const,

  /* --------------------
   * 내 게시글
   * -------------------- */
  myPosts: () => [...postQueryKeys.lists(), 'me'] as const,

  /* --------------------
   * 스크랩한 게시글
   * -------------------- */
  scraps: () => [...postQueryKeys.lists(), 'scraps'] as const,
};
