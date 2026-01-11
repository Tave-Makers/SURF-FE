import BoardPage from '@/app-pages/board/ui/BoardPage';

const Page = async ({ params }: { params: Promise<{ boardId: string }> }) => {
  const { boardId } = await params;
  return <BoardPage boardId={boardId} />;
};

export default Page;
