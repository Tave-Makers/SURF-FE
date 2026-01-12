import PostDetailPage from '@/app-pages/post/PostDetailPage';

const Page = async ({ params }: { params: Promise<{ boardId: string; postId: string }> }) => {
  const { postId } = await params;

  return <PostDetailPage postId={postId} />;
};

export default Page;
