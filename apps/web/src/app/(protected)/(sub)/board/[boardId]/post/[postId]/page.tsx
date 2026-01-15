import { redirect } from 'next/navigation';
import PostDetailPage from '@/app-pages/post/PostDetailPage';

const Page = async ({ params }: { params: Promise<{ boardId: number; postId: number }> }) => {
  const { boardId, postId } = await params;
  if (!Number.isFinite(postId)) {
    redirect(`/board/${boardId}`);
  }

  return <PostDetailPage postId={postId} />;
};

export default Page;
