'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PostListContainer } from '@/widgets/post-list/ui/PostListContainer';
import { Tab } from '@/shared/ui/tab/Tab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { TAB_CATEGORIES, TAB_CATEGORY_LIST } from '@/entities/post/model/tab';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { POST_BOARDS } from '@/entities/post/model/board';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';

const BoardPage = ({ boardId: boardIdProp }: { boardId: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // boardId
  const rawBoardId = Number(boardIdProp);
  const boardId = Number.isNaN(rawBoardId) || rawBoardId <= 0 ? 1 : rawBoardId;

  const boardInfo = POST_BOARDS.find((b) => b.id === boardId);

  // category
  const rawCategory = searchParams.get('category') ?? 'all';
  const categoryKey = (
    rawCategory in TAB_CATEGORIES ? rawCategory : 'all'
  ) as keyof typeof TAB_CATEGORIES;

  const userLevel = useAuthStore((state) => state.memberRole) ?? 'member';

  const handleCategoryChange = (nextCategoryKey: string) => {
    if (nextCategoryKey === 'all') {
      router.push(`/board/${boardId}`);
    } else {
      router.push(`/board/${boardId}?category=${nextCategoryKey}`);
    }
  };

  return (
    <>
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: boardInfo?.label ?? '',
          hasLeftIcon: true,
          icons: [
            {
              label: 'Search',
              // onClickIcon: () => router.push('/board/search'),
            },
          ],
        }}
      />
      <div className="flex h-full flex-col">
        <Tab items={TAB_CATEGORY_LIST} value={categoryKey} onValueChange={handleCategoryChange} />

        <div className="flex flex-1 overflow-auto px-13 pt-13">
          <PostListContainer boardId={boardId} category={categoryKey} userLevel={userLevel} />
        </div>
      </div>
      {userLevel !== 'member' && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="relative mx-auto h-full sm:max-w-[360px]">
            <div className="pointer-events-auto absolute right-15 bottom-15">
              <PostFab onClick={() => router.push(`/board/${boardId}/post/create`)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardPage;
