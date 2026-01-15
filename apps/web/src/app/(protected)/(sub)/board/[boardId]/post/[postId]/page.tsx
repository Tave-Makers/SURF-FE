import { redirect } from 'next/navigation';
import PostDetailPage from '@/app-pages/post/PostDetailPage';

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
  return <PostDetailPage postId={numericPostId} />;
};

export default Page;
