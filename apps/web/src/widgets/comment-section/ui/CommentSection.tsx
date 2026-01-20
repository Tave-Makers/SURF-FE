import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import type { CommentResponse } from '@/features/comment/api/types';
import { COMMENT_DEFAULT_PAGE, COMMENT_PAGE_SIZE } from '@/features/comment/model/constant';
import { useDeleteCommentMutation } from '@/features/comment/model/useDeleteCommentMutation';
import { useGetCommentsQuery } from '@/features/comment/model/useGetCommentsQuery';
import { useToggleCommentLikeMutation } from '@/features/comment/model/useToggleCommentLikeMutation';
import { Comment } from '@/features/comment/ui/Comment';
import CommentsEmpty from '@/shared/assets/icons/empty-space/comments-empty.svg';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { toDate, toKST, formatDateTime } from '@/shared/utils/date';

interface Props {
  postId: number;
  memberId?: number;
  // 답글 시작을 부모로 올림
  onStartReply: (info: { commentId: number; memberId: number; nickname: string }) => void;
}

export const CommentSection = ({ postId, memberId, onStartReply }: Props) => {
  const myId = useAuthStore((s) => s.memberId);

  const showToast = useToastStore((s) => s.show);
  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const { data, isLoading, isError } = useGetCommentsQuery(
    postId,
    COMMENT_DEFAULT_PAGE,
    COMMENT_PAGE_SIZE,
    true,
  );

  const toggleLikeMutation = useToggleCommentLikeMutation(
    postId,
    COMMENT_DEFAULT_PAGE,
    COMMENT_PAGE_SIZE,
  );

  const deleteMutation = useDeleteCommentMutation(postId, COMMENT_DEFAULT_PAGE, COMMENT_PAGE_SIZE);

  const comments = data?.comments ?? [];
  const totalCount = data?.totalCount ?? 0;

  const isMine = (c: CommentResponse) => {
    const currentId = memberId ?? myId;
    return currentId != null ? c.memberId === currentId : false;
  };

  const handleDelete = (comment: CommentResponse) => {
    const commentId = comment.id;

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
            void (async () => {
              try {
                await deleteMutation.mutateAsync(commentId);
                closeAlert();
                showToast('댓글이 삭제됐어요');
              } catch (e) {
                console.error(e);
                closeAlert();
                showToast('댓글 삭제에 실패했어요');
              }
            })();
          },
        },
      ],
    });
  };

  const handleReport = () => {
    showToast('신고 기능 준비 중입니다.');
  };

  const openOptions = (c: CommentResponse) => {
    openBottomSheet({
      type: 'commentOption',
      props: {
        isMine: isMine(c),
        onDelete: () => handleDelete(c),
        onReport: handleReport,
      },
    });
  };

  if (isLoading) {
    return <div className="px-13 pt-16 text-center text-gray-500">댓글을 불러오는 중...</div>;
  }
  if (isError) {
    return <div className="px-13 py-16 text-center text-red-500">댓글을 불러오지 못했습니다.</div>;
  }

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-11 px-13 pt-16 pb-16">
        <div className="flex items-center gap-5">
          <span className="text-body-body4 text-foreground-normal">댓글 {totalCount}</span>
        </div>

        <div className="flex w-full flex-col gap-13">
          {comments.map((c) => {
            const createdAtKst = toKST(toDate(c.createdAt));
            const dateText = formatDateTime(createdAtKst);

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
              <CommentsEmpty className="h-[3.16rem] w-[4.53rem]" />
              <div className="text-body-body8 text-foreground-tertiary">첫 댓글을 남겨보세요!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
