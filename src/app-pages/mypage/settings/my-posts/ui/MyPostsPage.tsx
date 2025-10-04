'use client';

import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';

export default function MyPostsPage() {
  return <PostListPage useInfiniteQueryHook={useInfiniteMyPosts} />;
}
