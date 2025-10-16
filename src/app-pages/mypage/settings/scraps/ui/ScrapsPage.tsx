'use client';

import { useInfiniteScraps } from '@/features/post/model/useScraps';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';

export default function ScrapsPage() {
  return (
    <div className="flex h-full">
      <PostListPage useInfiniteQueryHook={useInfiniteScraps} />
    </div>
  );
}
