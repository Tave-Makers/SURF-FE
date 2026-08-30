'use client';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { useCommentQuery } from '@/features/comment/model/useCommentQuery';
import type { ReportTargetType } from '@/features/report';

type ReportTarget = {
  targetType: ReportTargetType;
  targetId: number;
  writer: string;
  contentLabel: string;
  content: string;
};

/**
 * 신고 화면에 보여줄 대상(게시글 또는 댓글)의 작성자·제목/내용을 해석한다.
 * commentId가 있으면 댓글 신고, 없으면 게시글 신고.
 */
export const useReportTarget = (
  postId: number,
  commentId: number | null,
  options?: { enabled?: boolean },
) => {
  const enabled = options?.enabled ?? true;
  const isCommentReport = commentId !== null;

  const {
    data: post,
    isLoading: isPostLoading,
    isError: isPostError,
  } = usePostDetail(postId, { enabled: enabled && !isCommentReport });

  const {
    data: targetComment,
    isLoading: isCommentLoading,
    isError: isCommentError,
  } = useCommentQuery(commentId, enabled);

  const isLoading = isCommentReport ? isCommentLoading : isPostLoading;

  const target: ReportTarget | null = (() => {
    if (isCommentReport) {
      if (!targetComment) return null;
      return {
        targetType: 'comment',
        targetId: targetComment.id,
        writer: targetComment.nickname,
        contentLabel: '내용',
        content: targetComment.content,
      };
    }

    if (!post) return null;
    return {
      targetType: 'post',
      targetId: post.postId,
      writer: post.writer,
      contentLabel: '제목',
      content: post.title,
    };
  })();

  const isError = isCommentReport ? isCommentError || (!isLoading && !target) : isPostError;

  return { target, isLoading, isError };
};
