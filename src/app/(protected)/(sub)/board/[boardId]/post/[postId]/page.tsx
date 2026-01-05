import PostDetailPage from '@/app-pages/post/PostDetailPage';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ boardId: string; postId: string }>;
}) {
  const { postId } = await params;
  const numericPostId = Number(postId);
  if (!Number.isFinite(numericPostId)) {
    redirect('/board/1');
  }
  return <PostDetailPage postId={postId} />;
}
