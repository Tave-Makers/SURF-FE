'use client';

import { useSearchParams } from 'next/navigation';

import { useReportTarget } from '../model/useReportTarget';
import { ReportForm } from '@/features/report';
import { PageError, PageLoading } from '@/shared/ui/page-status/PageStatus';

interface PostReportPageProps {
  postId: number;
}

const PostReportPage = ({ postId }: PostReportPageProps) => {
  const searchParams = useSearchParams();

  // commentId가 없으면 게시글 신고. 있는데 유효하지 않으면 대상을 특정할 수 없으므로 오류로 처리한다.
  const commentIdParam = searchParams.get('commentId');
  const parsedCommentId = commentIdParam === null ? null : Number(commentIdParam);
  const commentId =
    parsedCommentId !== null && Number.isSafeInteger(parsedCommentId) && parsedCommentId > 0
      ? parsedCommentId
      : null;
  const hasInvalidCommentId = commentIdParam !== null && commentId === null;

  const { target, isLoading, isError } = useReportTarget(postId, commentId, {
    enabled: !hasInvalidCommentId,
  });

  if (hasInvalidCommentId) return <PageError message="신고할 댓글을 찾을 수 없어요." />;

  if (isLoading) return <PageLoading label="신고 대상을 불러오는 중이에요" />;

  if (isError || !target) return <PageError message="신고 대상을 불러오지 못했습니다." />;

  return <ReportForm {...target} />;
};

export default PostReportPage;
