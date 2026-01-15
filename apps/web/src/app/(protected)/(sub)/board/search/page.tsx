import BoardSearchPage from '@/app-pages/board/search/ui/BoardSearchPage';
import { getRecentSearches } from '@/features/recent-search/api/getRecentSearch.server';

type SearchParams = Promise<{ keyword?: string; category?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const recent = await getRecentSearches();

  const keywordFromQuery = sp.keyword?.trim() || null;

  return (
    <BoardSearchPage
      key={keywordFromQuery ?? 'landing'}
      initialRecent={recent}
      keywordFromQuery={keywordFromQuery}
    />
  );
};

export default Page;
