'use client';

import { useEffect } from 'react';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { COMMENT_PAGE_SIZE } from '@/features/comment/model/constant';
import { useInfiniteCommentsQuery } from '@/features/comment/model/useInfiniteCommentsQuery';
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
    data: commentPages,
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteCommentsQuery(postId, COMMENT_PAGE_SIZE, enabled && isCommentReport);

  const targetComment = isCommentReport
    ? (commentPages?.pages
        .flatMap((page) => page.comments)
        .find((comment) => comment.id === commentId) ?? null)
    : null;

  // 신고 대상 댓글이 아직 불러오지 않은 페이지에 있을 수 있어, 찾을 때까지 다음 페이지를 가져온다
  useEffect(() => {
    if (!enabled || !isCommentReport || targetComment || !hasNextPage || isFetchingNextPage) return;
    void fetchNextPage();
  }, [enabled, isCommentReport, targetComment, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isCommentSearching =
    isCommentReport && !targetComment && (isCommentsLoading || isFetchingNextPage || hasNextPage);

  const isLoading = isCommentReport ? isCommentSearching : isPostLoading;

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

  const isError = isCommentReport ? isCommentsError || (!isLoading && !target) : isPostError;

  return { target, isLoading, isError };
};
