import BoardSearchPage from '@/app-pages/board/search/ui/BoardSearchPage';
import { POST_BOARDS } from '@/entities/post/model/board';
import { getRecentSearches } from '@/features/recent-search/api/getRecentSearch.server';

type SearchParams = Promise<{ keyword?: string; category?: string; boardId?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const sp = await searchParams;
  const recent = await getRecentSearches();

  const keywordFromQuery = sp.keyword?.trim() || null;

  const rawBoardId = Number(sp.boardId);
  const boardId = POST_BOARDS.some((b) => b.id === rawBoardId) ? rawBoardId : POST_BOARDS[0].id;

  return (
    <BoardSearchPage
      key={`${boardId}-${keywordFromQuery ?? 'landing'}`}
      initialRecent={recent}
      keywordFromQuery={keywordFromQuery}
      boardId={boardId}
    />
  );
};

export default Page;
