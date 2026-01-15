import { redirect } from 'next/navigation';
import PostDetailPage from '@/app-pages/post/PostDetailPage';

const Page = async ({ params }: { params: Promise<{ boardId: string; postId: string }> }) => {
  const { postId } = await params;
  const numericPostId = Number(postId);
  if (!Number.isFinite(numericPostId)) {
    redirect('/board/1');
  }

  return <PostDetailPage postId={numericPostId} />;
};

export default Page;
