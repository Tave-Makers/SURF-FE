'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import RecentSearch from '@/features/recent-search/ui/RecentSearch';
import { TAB_CATEGORIES, TAB_CATEGORY_LIST, type TabCategoryKey } from '@/entities/post/model/tab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { SearchPostListContainer } from '@/features/post/search-post/ui/SearchPostListContainer';
import { Tab } from '@/shared/ui/tab/Tab';

interface BoardSearchPageProps {
  initialRecent: string[];
  keywordFromQuery: string | null;
}

export default function BoardSearchPage({ initialRecent, keywordFromQuery }: BoardSearchPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(keywordFromQuery ?? '');

  const handleSubmit = () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    router.replace(`/board/search?keyword=${encodeURIComponent(trimmed)}&category=all`);
  };

  const rawCategory = searchParams.get('category') ?? 'all';
  const categoryKey = (rawCategory in TAB_CATEGORIES ? rawCategory : 'all') as TabCategoryKey;

  const userLevel = useAuthStore((s) => s.memberRole) ?? 'member';

  const handleCategoryChange = (next: string) => {
    if (!keywordFromQuery) return;

    const nextKey = (next in TAB_CATEGORIES ? next : 'all') as TabCategoryKey;

    router.replace(
      `/board/search?keyword=${encodeURIComponent(keywordFromQuery)}&category=${encodeURIComponent(
        nextKey,
      )}`,
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

      {!keywordFromQuery && <RecentSearch recentKeywords={initialRecent} />}

      {keywordFromQuery && (
        <div className="flex h-full flex-col">
          <div className="flex w-full">
            <Tab
              items={TAB_CATEGORY_LIST}
              value={categoryKey}
              onValueChange={handleCategoryChange}
            />
          </div>

          <div className="flex flex-1 overflow-auto px-13 pt-13">
            <SearchPostListContainer
              keyword={keywordFromQuery}
              category={categoryKey}
              userLevel={userLevel}
            />
          </div>
        </div>
      )}
    </div>
  );
}
