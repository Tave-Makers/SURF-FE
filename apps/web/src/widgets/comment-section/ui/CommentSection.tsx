'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { toDate, toKST, formatDateTime } from '@surf/utils';
// import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { useAuthStore } from '@/features/auth/model/useAuthStore';
import type { CommentResponse } from '@/features/comment/api/types';
import { trackCommentEvent } from '@/features/comment/lib/trackCommentEvent';
import { COMMENT_PAGE_SIZE } from '@/features/comment/model/constant';
import { COMMENT_EVENTS } from '@/features/comment/model/types';
import { useDeleteCommentMutation } from '@/features/comment/model/useDeleteCommentMutation';
import { useInfiniteCommentsQuery } from '@/features/comment/model/useInfiniteCommentsQuery';
import { useToggleCommentLikeMutation } from '@/features/comment/model/useToggleCommentLikeMutation';
import { Comment } from '@/features/comment/ui/Comment';
import CommentsEmpty from '@/shared/assets/icons/empty-space/comments-empty.svg';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

// const CommentsEmpty = dynamic(
//   () => import('@/shared/assets/icons/empty-space/comments-empty.svg'),
//   {
//     ssr: false,
//       loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
//   },
// );

interface Props {
  postId: number;
  memberId?: number;
  scrollRootRef?: React.RefObject<HTMLDivElement | null>;
  isInteractionDisabled?: boolean;
  emptyMessage?: string;
  // 답글 시작을 부모로 올림
  onStartReply: (info: { commentId: number; memberId: number; nickname: string }) => void;
  // 댓글 신고 화면 이동을 부모로 올림 (boardId를 아는 쪽에서 라우팅)
  onReportComment: (commentId: number) => void;
}

export const CommentSection = ({
  postId,
  memberId,
  scrollRootRef,
  isInteractionDisabled = false,
  emptyMessage = '첫 댓글을 남겨보세요!',
  onStartReply,
  onReportComment,
}: Props) => {
  const router = useRouter();
  const { boardId } = useParams<{ boardId?: string }>();
  const myId = useAuthStore((s) => s.memberId);
  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const showToast = useToastStore((s) => s.show);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCommentsQuery(postId, COMMENT_PAGE_SIZE, true);

  const toggleLikeMutation = useToggleCommentLikeMutation(postId);

  const deleteMutation = useDeleteCommentMutation(postId);

  const comments = data?.pages.flatMap((page) => page.comments) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingNextPage) {
          fetchNextPage().catch((err) => {
            console.error('fetchNextPage error:', err);
          });
        }
      },
      { root: scrollRootRef?.current ?? null, rootMargin: '0px 0px 100px 0px' },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, scrollRootRef]);

  const isMine = (c: CommentResponse) => {
    const currentId = memberId ?? myId;
    return currentId != null ? c.memberId === currentId : false;
  };

  const openOptions = (c: CommentResponse) => {
    openBottomSheet({
      type: 'commentOption',
      props: {
        isMine: isMine(c),
        onDelete: () => clickDelete(c.id),
        onReport: () => onReportComment(c.id),
      },
    });
  };

  const clickDelete = (commentId: number) => {
    openAlert({
      state: 'default',
      title: '댓글을 정말 삭제하시겠습니까?',
      infoText: '삭제된 댓글은 복구되지 않습니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제하기',
          onClick: () => {
            trackCommentEvent(COMMENT_EVENTS.CLICK_COMMENT_DELETE, {
              post_id: postId,
              comment_id: commentId,
            });
            closeAlert();
            void (async () => {
              try {
                await deleteMutation.mutateAsync(commentId);
                showToast('댓글이 삭제됐어요');
              } catch (e) {
                console.error(e);
                showToast('댓글 삭제에 실패했어요');
              }
            })();
          },
        },
      ],
    });
  };

  if (isLoading) {
    return <div className="px-13 pt-16 text-center text-gray-500" />; //임시
  }
  if (isError) {
    return <div className="px-13 py-16 text-center text-red-500">댓글을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-11 pt-16 pb-16">
        <div className="flex items-center gap-5">
          <span className="text-body-body4 text-foreground-normal">댓글 {totalCount}</span>
        </div>
        <div className="flex w-full flex-col">
          <div className="flex w-full flex-col gap-13">
            {comments.map((c) => {
              const createdAtKst = toKST(toDate(c.createdAt));
              const dateText = formatDateTime(createdAtKst);

              const isClickable = c.memberId != null;

              return (
                <div key={c.id} className="flex flex-col">
                  <Comment
                    name={c.nickname}
                    profileImageUrl={c.profileImageUrl ?? undefined}
                    date={dateText}
                    content={c.content}
                    mentions={c.mentions}
                    likeCount={c.likeCount}
                    isLiked={c.liked}
                    onProfileClick={
                      isClickable
                        ? () => {
                            router.push(PAGE_ROUTES.MEMBER.PROFILE(c.memberId, boardId));
                          }
                        : undefined
                    }
                    onLikeToggle={() => {
                      if (isInteractionDisabled) return;
                      const nextState = c.liked ? 'off' : 'on';
                      trackCommentEvent(COMMENT_EVENTS.LIKE, {
                        target_type: 'comment',
                        target_id: c.id,
                        state: nextState,
                      });
                      toggleLikeMutation.mutate(c.id, {
                        onError: () => showToast('좋아요 처리에 실패했어요'),
                      });
                    }}
                    onReplyClick={() => {
                      if (isInteractionDisabled) return;
                      onStartReply({ commentId: c.id, memberId: c.memberId, nickname: c.nickname });
                    }}
                    onMoreClick={() => openOptions(c)}
                    isActionDisabled={isInteractionDisabled}
                  />
                </div>
              );
            })}

            {comments.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center gap-3 pt-[3rem]">
                <CommentsEmpty
                  className="h-[3.16rem] w-[4.53rem]"
                  aria-hidden="true"
                  focusable="false"
                />
                <div className="text-body-body8 text-foreground-tertiary">{emptyMessage}</div>
              </div>
            )}
          </div>
          <div ref={loadMoreRef} className="h-px w-full" />
          {isFetchingNextPage && (
            <div className="py-8 text-center text-sm text-gray-500">불러오는 중...</div>
          )}
        </div>
      </div>
    </div>
  );
};
