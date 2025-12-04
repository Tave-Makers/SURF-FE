'use client';

import PostPage from '@/app-pages/post/write/ui/PostPage';
import { useParams } from 'next/navigation';

export default function Page() {
  const { boardId } = useParams<{ boardId: string; postId: string }>();
  return <PostPage mode="create" boardId={boardId} />;
}
