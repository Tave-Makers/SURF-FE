import PostDetailPage from '@/app-pages/post/PostDetailPage';

export default async function Page({
  params,
}: {
  params: Promise<{ boardId: string; postId: string }>;
}) {
  const { postId } = await params;

  return <PostDetailPage postId={postId} />;
}
