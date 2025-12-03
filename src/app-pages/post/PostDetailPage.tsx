'use client';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';
import { useState } from 'react';
import { useGetPostLikesQuery } from '@/features/post/model/useGetPostLikesQuery';

import { Sheet } from '@/shared/ui/sheet/Sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { SheetItem } from '@/shared/ui/sheet-item/SheetItem';
import { Avatar } from '@/shared/ui/avatar/Avatar';

type PostDetailPageProps = {
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const numericPostId = Number(postId);

  // 게시글 상세 조회 API
  const { data, isLoading, isError } = usePostDetail(numericPostId);

  // 좋아요 누른 사람 목록 API
  const {
    data: likedUsersData,
    isLoading: isLikesLoading,
    isError: isLikesError,
    refetch: refetchLikedUsers,
  } = useGetPostLikesQuery(numericPostId, false);

  const [likedUsersOpen, setLikedUsersOpen] = useState(false);
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

  // 로딩/에러 처리
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

  const likedUsers = likedUsersData ?? [];

  const openLikedUsers = () => {
    void refetchLikedUsers();
    setLikedUsersOpen(true);
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* 스크롤 영역 */}
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        <main className="flex flex-col gap-[0.62rem] px-13 pt-13">
          {/* TODO: 링크 연결 */}
          <PostHeader
            title={post.title}
            category={{ title: post.boardLabel }}
            subCategory={{ title: post.categoryLabel }}
          />

          <PostBodySection post={post} onClickLikeCount={openLikedUsers} />
        </main>
      </div>

      {/* 댓글 입력창 */}
      <div className="sticky bottom-0 w-full" style={{ paddingBottom: keyboardOffset }}>
        <ActionBar placeholder="댓글을 입력해주세요" />
      </div>
      {/* ============================= */}
      {/* 좋아요 누른 사용자 Sheet */}
      {/* ============================= */}
      <ModalSheet isOpen={likedUsersOpen} onClose={() => setLikedUsersOpen(false)}>
        <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[360px]">
          <ModalSheet.Header />
          <ModalSheet.Content>
            <Sheet title="좋아요를 누른 사람">
              <div className="flex flex-col">
                {/* 로딩 */}
                {isLikesLoading && (
                  <div className="py-4 text-center text-gray-500">불러오는 중...</div>
                )}

                {/* 에러 */}
                {isLikesError && (
                  <div className="py-4 text-center text-red-500">
                    좋아요 목록을 불러오지 못했습니다.
                  </div>
                )}

                {/* 목록 */}
                {!isLikesLoading &&
                  !isLikesError &&
                  likedUsers.map((user) => (
                    <SheetItem
                      key={user.id}
                      title={user.name}
                      node={<Avatar size="xs" src={user.profileImageUrl} className="rounded-3!" />}
                    />
                  ))}

                {/* 비어 있을 때 */}
                {!isLikesLoading && !isLikesError && likedUsers.length === 0 && (
                  <div className="py-4 text-center text-gray-500">좋아요가 없습니다.</div>
                )}
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>

        <ModalSheet.Backdrop onTap={() => setLikedUsersOpen(false)} />
      </ModalSheet>
    </div>
  );
}
