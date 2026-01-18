'use client';

import { ActionBar } from '@surf/ui/action-bar';
import { HeaderMode } from '@surf/ui/header';
import { useAlertStore } from '@surf/ui/store/alertStore';
import { useToastStore } from '@surf/ui/store/toastStore';
import { usePathname, useRouter } from 'next/navigation';
import { usePostDetail } from '@/entities/post/api/usePostDetail';
import { categoryIdToKey } from '@/entities/post/model/category';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { useDeletePostMutation } from '@/features/post/model/useDeletePostMutation';
import { useGetPostLikesQuery } from '@/features/post/model/useGetPostLikesQuery';
import { useGetPostScheduleQuery } from '@/features/post/model/useGetPostScheduleQuery';
import { PAGE_ROUTES } from '@/shared/config/path';
import { useKeyboardOffset } from '@/shared/hooks/useKeyboardOffset';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';

interface PostDetailPageProps {
  postId: number;
}

const PostDetailPage = ({ postId }: PostDetailPageProps) => {
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

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const openBottomSheet = useBottomSheetStore((s) => s.open);
  const closeBottomSheet = useBottomSheetStore((s) => s.close);
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
    openBottomSheet({
      type: 'postLike',
      props: {
        likedUsers,
        isLoading: isLikesLoading,
        isError: isLikesError,
      },
    });
  };

  const handleDelete = () => {
    deletePostMutate(numericPostId, {
      onSuccess: () => {
        closeAlert();

        // 저장된 경로 확인
        const entryPath = sessionStorage.getItem('entry_path');

        if (entryPath) {
          // 저장된 경로(스크랩 또는 내 게시물 목록)로 이동
          router.replace(entryPath);
          sessionStorage.removeItem('entry_path');
        } else {
          router.replace(PAGE_ROUTES.BOARD.SELECT_CATEGORY(post.boardId));
        }

        showToast('게시글이 삭제되었습니다.');
      },
    });
  };

  // 삭제 경고 알러트
  const openDeleteAlert = () => {
    openAlert({
      state: 'default',
      title: '게시글을 정말 삭제하시겠습니까?',
      infoText: '삭제된 게시글은 복구되지 않습니다.',
      actions: [
        {
          type: 'solid',
          variant: 'secondary',
          label: '취소',
          onClick: () => closeAlert(),
        },
        {
          type: 'solid',
          variant: 'danger',
          label: '삭제',
          onClick: () => void handleDelete(),
        },
      ],
    });
  };

  const handleOpenOptions = () => {
    openBottomSheet({
      type: 'postOption',
      props: {
        isMine: post.isMine,
        onEdit: () => {
          router.push(`${pathname}/edit`);
          closeBottomSheet();
        },
        onDelete: () => {
          openDeleteAlert();
        },
        onReport: () => {
          alert('신고 기능 준비 중입니다.');
        },
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
              onClickIcon: handleOpenOptions,
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
    </div>
  );
};

export default PostDetailPage;
