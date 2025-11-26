'use client';

import { usePostDetail } from '@/features/post/model/usePostDetailQuery';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';

type PostDetailPageProps = {
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const numericPostId = Number(postId);

  const { data, isLoading, isError } = usePostDetail(numericPostId);

  // postId 유효성 검증
  if (isNaN(numericPostId) || numericPostId <= 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>잘못된 게시글 ID입니다.</span>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>불러오는 중...</span>
      </div>
    );

  if (isError || !data)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>게시글을 불러오지 못했습니다.</span>
      </div>
    );

  const post = data;

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <main className="flex flex-col gap-[0.62rem] px-13 pt-13">
          <PostHeader
            title={post.title}
            category={{ title: post.boardLabel }}
            subCategory={{ title: post.categoryLabel }}
          />

          <PostBodySection post={post} />
        </main>
      </div>

      {/* 댓글 입력창 */}
      <div className="sticky bottom-0 w-full">
        <ActionBar placeholder="댓글을 입력해주세요" />
      </div>
    </div>
  );
}
