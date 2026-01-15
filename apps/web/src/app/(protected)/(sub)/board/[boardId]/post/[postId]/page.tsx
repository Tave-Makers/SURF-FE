import { redirect } from 'next/navigation';
import PostDetailPage from '@/app-pages/post/PostDetailPage';

const Page = async ({ params }: { params: Promise<{ boardId: string; postId: string }> }) => {
  const { boardId, postId: postIdParam } = await params;
  const postId = Number(postIdParam);

  if (!Number.isFinite(postId)) {
    redirect(`/board/${boardId}`);
  }

  return <PostDetailPage postId={postId} />;
};

export default Page;
