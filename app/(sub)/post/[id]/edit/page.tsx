'use client';

import PostPage from '@/app-pages/post/ui/PostPage';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <PostPage mode="edit" postId={id} />;
}
