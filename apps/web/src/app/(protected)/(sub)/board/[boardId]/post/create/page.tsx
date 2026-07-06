import { redirect } from 'next/navigation';
import PostPage from '@/app-pages/post/write/ui/PostPage';
import { POST_BOARDS } from '@/entities/post/model/board';
import { PAGE_ROUTES } from '@/shared/config/path';
import { verifySession } from '@/shared/lib/dal';

const Page = async ({ params }: { params: Promise<{ boardId: string }> }) => {
  const { boardId } = await params;

  const board = POST_BOARDS.find((b) => b.id === Number(boardId));

  if (board?.adminOnly) {
    const user = await verifySession();
    if (user.memberRole === 'member') redirect(PAGE_ROUTES.HOME);
  }

  return <PostPage mode="create" boardId={boardId} />;
};

export default Page;
