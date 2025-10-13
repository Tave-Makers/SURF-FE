'use client';

import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';

export default function MyPostsPage() {
  return (
    <div className="flex h-full">
      <PostListPage useInfiniteQueryHook={useInfiniteMyPosts} />
    </div>
  );
}
