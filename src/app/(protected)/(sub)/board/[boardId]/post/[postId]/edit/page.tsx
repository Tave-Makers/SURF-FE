'use client';

import PostPage from '@/app-pages/post/write/ui/PostPage';
import { useParams } from 'next/navigation';

export default function Page() {
  const { boardId, postId } = useParams<{ boardId: string; postId: string }>();
  return <PostPage mode="edit" boardId={boardId} postId={postId} />;
}
