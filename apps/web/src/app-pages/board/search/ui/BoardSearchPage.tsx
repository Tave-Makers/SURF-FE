'use client';

import { HeaderMode } from '@surf/ui/header';
import { Tab } from '@surf/ui/tab';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { BOARD_TAB_MAP } from '@/entities/post/model/tab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { SearchPostListContainer } from '@/features/post/search-post/ui/SearchPostListContainer';
import { RecentSearch } from '@/features/recent-search/ui/RecentSearch';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

interface BoardSearchPageProps {
  initialRecent: string[];
  keywordFromQuery: string | null;
  boardId: number;
}

const BoardSearchPage = ({ initialRecent, keywordFromQuery, boardId }: BoardSearchPageProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(keywordFromQuery ?? '');

  const handleSubmit = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    router.replace(PAGE_ROUTES.BOARD.SEARCH({ boardId, keyword: trimmed, category: 'all' }));
  };

  const boardTabs = BOARD_TAB_MAP[boardId] ?? [];
  const rawCategory = searchParams.get('category') ?? 'all';
  const categoryKey = boardTabs.some((t) => t.value === rawCategory) ? rawCategory : 'all';

  const userLevel = useAuthStore((s) => s.memberRole) ?? 'member';

  const handleCategoryChange = (next: string) => {
    if (!keywordFromQuery) return;

    const nextKey = boardTabs.some((t) => t.value === next) ? next : 'all';

    router.replace(
      PAGE_ROUTES.BOARD.SEARCH({ boardId, keyword: keywordFromQuery, category: nextKey }),
    );
  };

  return (
    <div className="flex h-full w-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.SearchBar,
          value: keyword,
          onChange: setKeyword,
          onSubmit: handleSubmit,
          hasLeftIcon: true,
        }}
      />

      {!keywordFromQuery && <RecentSearch recentKeywords={initialRecent} boardId={boardId} />}

      {keywordFromQuery && (
        <div className="flex h-full flex-col">
          <div className="flex w-full">
            <Tab items={boardTabs} value={categoryKey} onValueChange={handleCategoryChange} />
          </div>

          <div className="flex flex-1 overflow-auto px-13 pt-13">
            <SearchPostListContainer
              keyword={keywordFromQuery}
              boardId={boardId}
              category={categoryKey}
              userLevel={userLevel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardSearchPage;
