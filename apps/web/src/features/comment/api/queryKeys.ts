export const commentKeys = {
  all: ['comments'] as const,
  post: (postId: number) => [...commentKeys.all, postId] as const,
  lists: (postId: number) => [...commentKeys.post(postId), 'list'] as const,
  list: (postId: number, page: number, size: number) =>
    [...commentKeys.lists(postId), { page, size }] as const,
};
