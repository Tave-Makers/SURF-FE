import { redirect } from 'next/navigation';
import PostReportPage from '@/app-pages/post/report/ui/PostReportPage';

const Page = async ({ params }: { params: Promise<{ boardId: string; postId: string }> }) => {
  const { boardId, postId: postIdParam } = await params;
  const numericBoardId = Number(boardId);
  const numericPostId = Number(postIdParam);

  if (!Number.isFinite(numericBoardId)) {
    redirect('/board/1');
  }

  if (!Number.isFinite(numericPostId)) {
    redirect(`/board/${numericBoardId}`);
  }

  return <PostReportPage postId={numericPostId} />;
};

export default Page;
