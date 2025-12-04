'use client';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';

type PostDetailPageProps = {
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const numericPostId = Number(postId);

  const { data, isLoading, isError } = usePostDetail(numericPostId);

  /** 키보드 높이 계산 */
  const keyboardOffset = useKeyboardOffset();

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
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <main className="flex flex-col gap-[0.62rem] px-13 pt-13">
          {/* TODO: 링크 연결 */}
          <PostHeader
            title={post.title}
            category={post.boardLabel ? { title: post.boardLabel } : undefined}
            subCategory={post.categoryLabel ? { title: post.categoryLabel } : undefined}
          />

          <PostBodySection post={post} />
        </main>
      </div>

      {/* 댓글 입력창 */}
      <div className="sticky bottom-0 w-full" style={{ paddingBottom: keyboardOffset }}>
        <ActionBar placeholder="댓글을 입력해주세요" />
      </div>
    </div>
  );
}
