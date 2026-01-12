'use client';

import { useParams } from 'next/navigation';
import PostPage from '@/app-pages/post/write/ui/PostPage';

const Page = () => {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  return <PostPage mode="edit" boardId={boardId} postId={postId} />;
};

export default Page;
