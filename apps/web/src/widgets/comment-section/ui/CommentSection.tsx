'use client';

import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import type { CommentResponse } from '@/features/comment/api/types';
import { COMMENT_PAGE_SIZE } from '@/features/comment/model/constant';
import { useDeleteCommentMutation } from '@/features/comment/model/useDeleteCommentMutation';
import { useInfiniteCommentsQuery } from '@/features/comment/model/useInfiniteCommentsQuery';
import { useToggleCommentLikeMutation } from '@/features/comment/model/useToggleCommentLikeMutation';
import { Comment } from '@/features/comment/ui/Comment';
import CommentsEmpty from '@/shared/assets/icons/empty-space/comments-empty.svg';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { toDate, toKST, formatDateTime } from '@/shared/utils/date';

interface Props {
  postId: number;
  memberId?: number;
  scrollRootRef?: React.RefObject<HTMLDivElement | null>;
  // 답글 시작을 부모로 올림
  onStartReply: (info: { commentId: number; memberId: number; nickname: string }) => void;
}

export const CommentSection = ({ postId, memberId, scrollRootRef, onStartReply }: Props) => {
  const router = useRouter();
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
        onReport: clickReport,
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

  const clickReport = () => {
    showToast('신고 기능 준비 중입니다.');
  };

  if (isLoading) {
    return <div className="px-13 pt-16 text-center text-gray-500">댓글을 불러오는 중...</div>;
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
                            router.push(PAGE_ROUTES.MEMBER.PROFILE(c.memberId));
                          }
                        : undefined
                    }
                    onLikeToggle={() =>
                      toggleLikeMutation.mutate(c.id, {
                        onError: () => showToast('좋아요 처리에 실패했어요'),
                      })
                    }
                    onReplyClick={() =>
                      onStartReply({ commentId: c.id, memberId: c.memberId, nickname: c.nickname })
                    }
                    onMoreClick={() => openOptions(c)}
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
                <div className="text-body-body8 text-foreground-tertiary">
                  첫 댓글을 남겨보세요!
                </div>
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
