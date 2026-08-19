'use client';

import { useSearchParams } from 'next/navigation';

import { useReportTarget } from '../model/useReportTarget';
import { ReportForm } from '@/features/report';

interface PostReportPageProps {
  postId: number;
}

const PostReportPage = ({ postId }: PostReportPageProps) => {
  const searchParams = useSearchParams();
  const parsedCommentId = Number(searchParams.get('commentId'));
  const commentId =
    Number.isFinite(parsedCommentId) && parsedCommentId > 0 ? parsedCommentId : null;

  const { target, isLoading, isError } = useReportTarget(postId, commentId);

  if (isLoading) return <div className="flex h-full w-full items-center justify-center" />;

  if (isError || !target) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-body-body8 text-foreground-tertiary">
          신고 대상을 불러오지 못했습니다.
        </span>
      </div>
    );
  }

  return <ReportForm {...target} />;
};

export default PostReportPage;
