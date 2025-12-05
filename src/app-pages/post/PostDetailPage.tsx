'use client';

import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { useGetPostLikesQuery } from '@/features/post/model/useGetPostLikesQuery';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { SheetItem } from '@/shared/ui/sheet/SheetItem';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { useState } from 'react';
import { deletePost } from '@/features/post/api/deletePost';
import { Alert } from '@/shared/ui/alert/Alert';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/shared/ui/avatar/Avatar';

type PostDetailPageProps = {
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const router = useRouter();
  const numericPostId = Number(postId);
  const keyboardOffset = useKeyboardOffset();
  const overrideHeaderHeight = 48;

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

  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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

  const handleDelete = async () => {
    try {
      await deletePost(numericPostId);

      alert('게시글이 삭제되었습니다.');
      setShowDeleteAlert(false);
      router.push(`/board/${post.boardId}`);
    } catch (e) {
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
      console.error(e);
    }
  };

  return (
    <>
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: post.boardLabel ?? '',
          hasLeftIcon: true,
          icons: [
            {
              label: 'FatCornerUpRight',
              onClickIcon: () => alert('공유 기능 준비중'),
            },
            {
              label: 'Dots',
              onClickIcon: () => setOpen(true),
            },
          ],
        }}
      />

      {/* 본문 */}
      <div className="relative flex h-full min-h-0 w-full flex-col">
        {/* 스크롤 영역 */}
        <div
          className="scrollbar-hide flex-1 overflow-y-auto"
          style={{ paddingBottom: overrideHeaderHeight }}
        >
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
      </div>

      {/* 삭제 Alert */}
      <Alert
        state="default"
        title="게시글을 정말 삭제하시겠습니까?"
        infoText="삭제된 게시글은 복구되지 않습니다."
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        actions={[
          {
            type: 'solid',
            variant: 'secondary',
            label: '취소',
            onClick: () => setShowDeleteAlert(false),
          },
          {
            type: 'solid',
            variant: 'danger',
            label: '삭제',
            onClick: () => void handleDelete(),
          },
        ]}
      />
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
      {/* ============================= */}
      {/* 삭제/수정/신고 Sheet*/}
      {/* ============================= */}
      <ModalSheet isOpen={open} onClose={() => setOpen(false)}>
        <ModalSheet.Container className="!right-0 !left-0 mx-auto max-w-[360px]">
          <ModalSheet.Header />
          <ModalSheet.Content>
            <Sheet title="게시글 옵션">
              <div className="flex flex-col">
                {post.isMine ? (
                  <>
                    {/* 수정하기 */}
                    <SheetItem
                      title="수정하기"
                      node={<SurfIcon name="EditSolid" />}
                      onClick={() => {
                        setOpen(false);
                        alert('수정하기 클릭');
                      }}
                    />

                    {/* 삭제하기 */}
                    <SheetItem
                      title="삭제하기"
                      node={
                        <SurfIcon
                          name="TrashOneSolid"
                          className="text-foreground-foreground-danger"
                        />
                      }
                      onClick={() => {
                        setOpen(false);
                        setShowDeleteAlert(true);
                      }}
                      textColor="danger"
                    />
                  </>
                ) : (
                  <>
                    {/* 신고하기 */}
                    <SheetItem
                      title="신고하기"
                      // TODO: 신고 아이콘 추가
                      // node={<SurfIcon name="" />}
                      onClick={() => {
                        setOpen(false);
                        // TODO: 신고하기 기능 연동
                        alert('신고 기능 준비 중입니다.');
                      }}
                    />
                  </>
                )}
              </div>
            </Sheet>
          </ModalSheet.Content>
        </ModalSheet.Container>
        <ModalSheet.Backdrop onClick={() => setOpen(false)} />
      </ModalSheet>
    </>
  );
}
