export const postQueryKeys = {
  all: ['post'] as const,

  board: (boardId: number) => [...postQueryKeys.all, 'board', boardId] as const,

  boardPosts: (boardId: number, category?: string) =>
    [...postQueryKeys.board(boardId), category ?? 'all'] as const,

  myPosts: () => [...postQueryKeys.all, 'me'] as const,

  scraps: () => [...postQueryKeys.all, 'scraps'] as const,
};
