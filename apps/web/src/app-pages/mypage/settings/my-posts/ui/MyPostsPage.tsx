'use client';

// import dynamic from 'next/dynamic';
import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { trackMyPostsEvent } from '@/features/post/lib/trackMyPostsEvent';
import { MY_POSTS_EVENTS } from '@/features/post/model/types';
import { useInfiniteMyPosts } from '@/features/post/model/useMyPosts';
import { usePageName } from '@/shared/analytics/lib/getPageName';
import MyPostsEmpty from '@/shared/assets/icons/empty-space/myposts-empty.svg';
import { useDynamicScrollTracking } from '@/shared/hooks/useDynamicScrollTracking';
import { PostListPage } from '@/widgets/post-list/ui/PostListPage';

// const MyPostsEmpty = dynamic(() => import('@/shared/assets/icons/empty-space/myposts-empty.svg'), {
//   ssr: false,
//   loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
// });

const MyPostsPage = () => {
  const pageName = usePageName();
  const { memberRole } = useAuthStore();

  const userLevel = memberRole ?? 'member';

  useEffect(() => {
    trackMyPostsEvent(MY_POSTS_EVENTS.VIEW_MY_POSTS_PAGE, { page_name: pageName });
  }, [pageName]);

  useEffect(() => {
    sessionStorage.setItem('entry_path', window.location.pathname);
  }, []);

  const handleScrollThreshold = useCallback((percent: number) => {
    trackMyPostsEvent(MY_POSTS_EVENTS.SCROLL_MY_POSTS_PAGE, { percent });
  }, []);

  const scrollRef = useDynamicScrollTracking<HTMLDivElement>(handleScrollThreshold);

  const emptyView = (
    <div className="flex h-full flex-col items-center justify-center gap-12">
      <MyPostsEmpty className="h-[4.72rem] w-[5.68rem]" />
      <span className="text-body-body8 text-foreground-tertiary">아직 작성한 게시글이 없어요</span>
    </div>
  );

  return (
    <div className="flex h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-13 pt-13">
        <PostListPage
          useInfiniteQueryHook={useInfiniteMyPosts}
          onPostClick={(post) =>
            trackMyPostsEvent(MY_POSTS_EVENTS.CLICK_POST_CARD, { post_id: String(post.postId) })
          }
          scrollRootRef={scrollRef}
          userLevel={userLevel}
          emptyView={emptyView}
        />
      </div>
    </div>
  );
};

export default MyPostsPage;
