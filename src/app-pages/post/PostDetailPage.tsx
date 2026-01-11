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
import { Alert } from '@/shared/ui/alert/Alert';
import { usePathname, useRouter } from 'next/navigation';
import { Avatar } from '@/shared/ui/avatar/Avatar';
import { categoryIdToKey } from '@/entities/post/model/category';
import { useGetPostScheduleQuery } from '@/features/post/model/useGetPostScheduleQuery';
import { useDeletePostMutation } from '@/features/post/model/useDeletePostMutation';
import { useToastStore } from '@/shared/store/toastStore';
import { PAGE_ROUTES } from '@/shared/config/path';

type PostDetailPageProps = {
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const numericPostId = Number(postId);
  const keyboardOffset = useKeyboardOffset();
  const showToast = useToastStore((state) => state.show);

  // 게시글 상세 조회 API
  const { data: post, isLoading, isError } = usePostDetail(numericPostId);

  // 일정 조회 API
  const scheduleId = post?.scheduleId;

  const {
    data: schedule,
    isLoading: isScheduleLoading,
    isError: isScheduleError,
  } = useGetPostScheduleQuery(numericPostId, scheduleId, !!post?.hasSchedule);

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
  const { mutate: deletePostMutate } = useDeletePostMutation();

  // 로딩/에러 처리
  if (isLoading || (scheduleId && isScheduleLoading))
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>불러오는 중...</span>
      </div>
    );

  if (isError || !post)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span>게시글을 불러오지 못했습니다.</span>
      </div>
    );

  if (scheduleId && isScheduleError) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`일정 정보(ID: ${scheduleId})를 불러올 수 없습니다.`);
    }
  }

  const likedUsers = likedUsersData ?? [];

  const openLikedUsers = () => {
    void refetchLikedUsers();
    setLikedUsersOpen(true);
  };

  const handleDelete = () => {
    deletePostMutate(numericPostId, {
      onSuccess: () => {
        setShowDeleteAlert(false);

        // 저장된 경로 확인
        const entryPath = sessionStorage.getItem('entry_path');

        if (entryPath) {
          // 저장된 경로(스크랩 또는 내 게시물 목록)로 이동
          router.replace(entryPath);
          sessionStorage.removeItem('entry_path');
        } else {
          PAGE_ROUTES.BOARD.SELECT_CATEGORY(post.boardId);
        }

        showToast('게시글이 삭제되었습니다.');
      },
    });
  };

  return (
    <div className="flex h-full flex-col">
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
        <div className="scrollbar-hide flex-1 overflow-y-auto">
          <main className="flex flex-col gap-[0.62rem] px-13 pt-13">
            <PostHeader
              title={post.title}
              category={{
                title: post.boardLabel,
                href: `/board/${post.boardId}?category=all`,
              }}
              subCategory={{
                title: post.categoryLabel,
                href: `/board/${post.boardId}?category=${categoryIdToKey(post.categoryId)}`,
              }}
            />

            <PostBodySection post={post} schedule={schedule} onClickLikeCount={openLikedUsers} />
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
        <ModalSheet.Container className="!right-0 !left-0 mx-auto w-full sm:max-w-[360px]">
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
                        router.push(`${pathname}/edit`);
                      }}
                    />

                    {/* 삭제하기 */}
                    <SheetItem
                      title="삭제하기"
                      node={<SurfIcon name="TrashOneSolid" className="text-foreground-danger" />}
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
    </div>
  );
}
