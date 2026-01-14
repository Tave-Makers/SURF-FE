'use client';

import { HeaderMode } from '@surf/ui/header';
import { useState } from 'react';
import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { categoryIdToKey } from '@/entities/post/model/category';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { useGetSingleSchedule } from '@/features/schedule/edit/model/useGetSingleSchedule';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { CommentComposer } from '@/widgets/comment-composer/ui/CommentComposer';
import { CommentSection } from '@/widgets/comment-section/ui/CommentSection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';

type PostDetailPageProps = { postId: string };

const PostDetailPage = ({ postId }: PostDetailPageProps) => {
  const numericPostId = Number(postId);
  const keyboardOffset = useKeyboardOffset();

  const [pendingReply, setPendingReply] = useState<{
    commentId: number;
    memberId: number;
    nickname: string;
  } | null>(null);

  const { data: post, isLoading, isError } = usePostDetail(numericPostId);

  const scheduleId = post?.scheduleId;
  const { data: schedule, isLoading: isScheduleLoading } = useGetSingleSchedule(scheduleId, {
    enabled: !!scheduleId,
  });

  if (isLoading || (scheduleId && isScheduleLoading)) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>불러오는 중...</span>
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>게시글을 불러오지 못했습니다.</span>
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: post.boardLabel ?? '',
          hasLeftIcon: true,
          icons: [
            { label: 'FatCornerUpRight', onClickIcon: () => alert('공유 기능 준비중') },
            { label: 'Dots', onClickIcon: () => alert('옵션') },
          ],
        }}
      />

      <div className="scrollbar-hide flex w-full flex-1 flex-col overflow-y-auto pb-[88px]">
        <main className="flex flex-col gap-[0.62rem] px-13 pt-13">
          <PostHeader
            title={post.title}
            category={{ title: post.boardLabel, href: `/board/${post.boardId}?category=all` }}
            subCategory={{
              title: post.categoryLabel,
              href: `/board/${post.boardId}?category=${categoryIdToKey(post.categoryId)}`,
            }}
          />

          <PostBodySection post={post} schedule={schedule} onClickLikeCount={() => {}} />
        </main>

        <CommentSection postId={numericPostId} onStartReply={(info) => setPendingReply(info)} />
      </div>

      <CommentComposer
        postId={numericPostId}
        keyboardOffset={keyboardOffset}
        pendingReply={pendingReply}
        onConsumedReply={() => setPendingReply(null)}
      />
    </div>
  );
};

export default PostDetailPage;
