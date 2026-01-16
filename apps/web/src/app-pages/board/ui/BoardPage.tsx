'use client';

import { HeaderMode } from '@surf/ui/header';
import { Tab } from '@surf/ui/tab';
import { useSearchParams, useRouter } from 'next/navigation';
import { POST_BOARDS } from '@/entities/post/model/board';
import { TAB_CATEGORIES, TAB_CATEGORY_LIST } from '@/entities/post/model/tab';
import { PostFab } from '@/entities/post/ui/post-fab/PostFab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { usePostFormStore } from '@/features/post/post-form/model/usePostFormStore';
import { useCreatePostScheduleStore } from '@/features/schedule/create-post-schedule/model/useCreatePostScheduleStore';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { PostListContainer } from '@/widgets/post-list/ui/PostListContainer';

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
      router.replace(PAGE_ROUTES.BOARD.MAIN);
    } else {
      router.replace(`${PAGE_ROUTES.BOARD.SELECT_CATEGORY(boardId)}?category=${nextCategoryKey}`);
    }
  };

  // 게시글 생성 화면 이동 전 스토어 초기화
  const { resetForm } = usePostFormStore();
  const { clearLinkedSchedule } = useCreatePostScheduleStore();

  const handlePostClick = () => {
    resetForm();
    clearLinkedSchedule();
    router.push(PAGE_ROUTES.BOARD.POST_CREATE(boardId));
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
              onClickIcon: () => router.push(PAGE_ROUTES.BOARD.SEARCH),
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
          <div className="relative mx-auto h-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
            <div className="pointer-events-auto absolute right-15 bottom-15">
              <PostFab onClick={handlePostClick} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BoardPage;
