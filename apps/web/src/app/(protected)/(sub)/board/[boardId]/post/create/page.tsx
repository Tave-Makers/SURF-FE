'use client';

import { useParams } from 'next/navigation';
import PostPage from '@/app-pages/post/write/ui/PostPage';

const Page = () => {
  const { boardId } = useParams<{ boardId: string }>();
  return <PostPage mode="create" boardId={boardId} />;
};

export default Page;
