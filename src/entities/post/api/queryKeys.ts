export const postQueryKeys = {
  all: ['post'] as const,

  board: (boardId: number) => [...postQueryKeys.all, 'board', boardId] as const,

  boardPosts: (boardId: number, categoryKey?: string) =>
    [...postQueryKeys.board(boardId), categoryKey ?? 'all'] as const,

  myPosts: () => [...postQueryKeys.all, 'me'] as const,

  scraps: () => [...postQueryKeys.all, 'scraps'] as const,

  postDetail: (postId: number) => [...postQueryKeys.all, 'postDetail', postId] as const,
};
