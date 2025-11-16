'use client';

import { usePostDetail } from '@/entities/post/model/usePostDetailQuery';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';

type PostDetailPageProps = {
  boardId: string;
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const numericPostId = Number(postId);

  const { data, isLoading, isError } = usePostDetail(numericPostId);

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
            category={{ title: '공지사항' }} // 서버에 category 필드가 없어서 그대로 유지
            subCategory={{ title: '행사' }} // 서버에 없으므로 그대로 유지
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
