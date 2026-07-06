'use client';

import { Fab } from '@surf/ui/fab';
import { HeaderMode } from '@surf/ui/header';
import { Tab } from '@surf/ui/tab';
import { useSearchParams, useRouter } from 'next/navigation';
import { POST_BOARDS } from '@/entities/post/model/board';
import { BOARD_TAB_MAP } from '@/entities/post/model/tab';
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
  const boardTabs = BOARD_TAB_MAP[boardId];
  const categoryKey = boardTabs?.some((t) => t.value === rawCategory) ? rawCategory : 'all';

  const userLevel = useAuthStore((state) => state.memberRole) ?? 'member';

  const handleCategoryChange = (nextCategoryKey: string) => {
    const base = PAGE_ROUTES.BOARD.SELECT_CATEGORY(boardId);
    if (nextCategoryKey === 'all') {
      router.replace(base);
    } else {
      router.replace(`${base}?category=${nextCategoryKey}`);
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
    <div className="flex h-full min-h-0 flex-col">
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
      <div className="flex min-h-0 flex-1 flex-col">
        {BOARD_TAB_MAP[boardId] && (
          <Tab
            items={BOARD_TAB_MAP[boardId]}
            value={categoryKey}
            onValueChange={handleCategoryChange}
          />
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-auto px-13 pt-13 pb-13">
          <PostListContainer boardId={boardId} category={categoryKey} userLevel={userLevel} />
        </div>
      </div>
      {(userLevel !== 'member' || !boardInfo?.adminOnly) && (
        <div className="pointer-events-none fixed inset-0 z-50">
          <div className="relative mx-auto h-full sm:max-w-[min(100dvw,calc(100dvh*375/812))]">
            <div className="pointer-events-auto absolute right-15 bottom-15">
              <Fab onClick={handlePostClick} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPage;
