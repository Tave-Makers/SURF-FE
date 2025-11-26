'use client';

import { usePostDetail } from '@/features/post/model/usePostDetailQuery';
import { PostHeader } from '@/entities/post/ui/post-header/PostHeader';
import { ActionBar } from '@/shared/ui/action-bar/ActionBar';
import { PostBodySection } from '@/widgets/post-detail/PostBodySection';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { HeaderMode } from '@/shared/ui/header/Header';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { SheetItem } from '@/shared/ui/sheet-item/SheetItem';
import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deletePost } from '@/features/post/api/deletePost';
import { Alert } from '@/shared/ui/alert/Alert';

type PostDetailPageProps = {
  postId: string;
};

export default function PostDetailPage({ postId }: PostDetailPageProps) {
  const router = useRouter();
  const numericPostId = Number(postId);
  const { data, isLoading, isError } = usePostDetail(numericPostId);
  const [open, setOpen] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

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

      {/* 모달시트 */}
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
