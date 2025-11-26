'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { PostListContainer } from '@/widgets/post-list/ui/PostListContainer';
import { Tab } from '@/shared/ui/tab/Tab';
import { useAuthStore } from '@/features/auth/model/useAuthStore';

export default function PostPage() {
  const params = useSearchParams();
  const router = useRouter();

  const boardId = Number(params.get('boardId') ?? 1);
  const category = params.get('category') ?? 'all';

  const userLevel = useAuthStore((state) => state.memberRole) ?? 'member';

  const handleCategoryChange = (nextCategory: string) => {
    router.push(`?boardId=${boardId}&category=${nextCategory}`);
  };

  return (
    <div className="flex h-full flex-col">
      <Tab
        items={[
          { value: 'all', label: '전체' },
          { value: 'event', label: '행사' },
          { value: 'activity', label: '활동' },
          { value: 'partnership', label: '제휴' },
          { value: 'patch', label: '패치' },
          { value: 'etc', label: '기타' },
        ]}
        value={category}
        onValueChange={handleCategoryChange}
      />
      <div className="flex flex-1 overflow-auto px-13 pt-13">
        <PostListContainer boardId={boardId} category={category} userLevel={userLevel} />
      </div>
    </div>
  );
}
