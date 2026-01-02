import BoardSearchPage from '@/app-pages/board/search/ui/BoardSearchPage';
import { getRecentSearches } from '@/features/recent-search/api/getRecentSearch.server';

type SearchParams = Promise<{ keyword?: string; category?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;

  let recent: string[] = [];
  try {
    recent = await getRecentSearches();
  } catch (error) {
    console.error('Failed to fetch recent searches:', error);
  }

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
