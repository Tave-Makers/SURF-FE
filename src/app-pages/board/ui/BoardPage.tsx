'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PostListContainer } from '@/widgets/post-list/ui/PostListContainer';
import { Tab } from '@/shared/ui/tab/Tab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { TAB_CATEGORIES, TAB_CATEGORY_LIST } from '@/entities/post/model/tab';

export default function BoardPage() {
  const params = useSearchParams();
  const router = useRouter();

  const rawBoardId = Number(params.get('boardId'));
  const boardId = Number.isNaN(rawBoardId) || rawBoardId <= 0 ? 1 : rawBoardId;

  const rawCategory = params.get('category') ?? 'all';
  const categoryKey = (
    rawCategory in TAB_CATEGORIES ? rawCategory : 'all'
  ) as keyof typeof TAB_CATEGORIES;

  const userLevel = useAuthStore((state) => state.memberRole) ?? 'member';

  const handleCategoryChange = (nextCategoryKey: string) => {
    router.push(`?boardId=${boardId}&category=${nextCategoryKey}`);
  };

  return (
    <div className="flex h-full flex-col">
      <Tab items={TAB_CATEGORY_LIST} value={categoryKey} onValueChange={handleCategoryChange} />

      <div className="flex flex-1 overflow-auto px-13 pt-13">
        <PostListContainer boardId={boardId} category={categoryKey} userLevel={userLevel} />
      </div>
    </div>
  );
}
