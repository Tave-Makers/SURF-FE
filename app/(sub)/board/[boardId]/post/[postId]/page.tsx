import PostDetailPage from '@/app-pages/post/PostDetailPage';

export default function Page({ params }: { params: { boardId: string; postId: string } }) {
  return <PostDetailPage boardId={params.boardId} postId={params.postId} />;
}
