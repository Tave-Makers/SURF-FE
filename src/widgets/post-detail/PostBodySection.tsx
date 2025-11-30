'use client';

import { useState } from 'react';

import { PostProfile } from '@/entities/post/ui/post-profile/PostProfile';
import { ChipToggle } from '@/shared/ui/chip-toggle/ChipToggle';
import { PostDetail } from '@/entities/post/model/types';
import { useToggleLikeMutation } from '@/features/post/model/useToggleLikeMutation';
import { useToggleScrapMutation } from '@/features/post/model/useToggleScrapMutation';
import { EventCard } from '@/entities/calendar/ui/EventCard/EventCard';
import sanitizeHtml, { IOptions } from 'sanitize-html';
import { Sheet } from '@/shared/ui/sheet/Sheet';
import { Sheet as ModalSheet } from 'react-modal-sheet';
import { SheetItem } from '@/shared/ui/sheet-item/SheetItem';
import { Avatar } from '@/shared/ui/avatar/Avatar';

import { useGetPostLikesQuery } from '@/features/post/model/useGetPostLikesQuery';

export function PostBodySection({ post }: { post: PostDetail }) {
  // Sheet open 상태
  const [likedUsersOpen, setLikedUsersOpen] = useState(false);

  // 좋아요/스크랩 Mutation
  const likeMutation = useToggleLikeMutation();
  const scrapMutation = useToggleScrapMutation();

  // 좋아요 누른 사람 목록 API 훅
  const { data, refetch, isLoading, isError } = useGetPostLikesQuery(post.postId, false);

  // 좋아요 누른 사람 목록
  const likedUsers = data ?? [];

  // 좋아요 토글
  const handleLikeToggle = () => {
    if (likeMutation.isPending) return;

    likeMutation.mutate({
      postId: post.postId,
      liked: post.likedByMe,
    });
  };

  // 스크랩 토글
  const handleScrapToggle = () => {
    if (scrapMutation.isPending) return;

    scrapMutation.mutate({
      postId: post.postId,
      scrapped: post.scrappedByMe,
    });
  };

  // 좋아요 목록 열기
  const openLikedUsers = () => {
    refetch().catch(() => {});
    setLikedUsersOpen(true);
  };

  const sanitizeOptions: IOptions = {
    allowedTags: ['p', 'strong'],
  };

  const cleanContent = sanitizeHtml(post.content, sanitizeOptions);

  return (
    <div className="flex flex-col gap-[1.5rem]">
      <PostProfile
        nickname={post.writer}
        date={post.date}
        time={post.time}
        viewCount={post.viewCount}
      />
      <div className="whitespace-pre-line" dangerouslySetInnerHTML={{ __html: cleanContent }} />

      {/* 이미지 영역 */}
      {post.imageUrlList?.length > 0 && (
        <div className="flex flex-col gap-[0.62rem]">
          {post.imageUrlList.map((img) =>
            img.originalUrl && img.originalUrl.trim() !== '' ? (
              <div key={img.imageId} className="w-full">
                <img
                  src={img.originalUrl}
                  alt={`post-image-${img.imageId}`}
                  className="w-full rounded-[0.5rem]"
                />
              </div>
            ) : null,
          )}
        </div>
      )}

      {/* 일정 카드 */}
      {post.hasSchedule && (
        <EventCard title="후반기 만남의 장" type="official" mode="reservation" place="추후 공지" />
      )}

      {/* 좋아요 / 스크랩 */}
      <div className="flex justify-between">
        <ChipToggle
          isClicked={post.likedByMe}
          count={post.likeCount}
          onToggleIcon={handleLikeToggle}
          iconName="Heart"
          activeColor="red"
          onClickNumber={openLikedUsers}
        />

        <ChipToggle
          isClicked={post.scrappedByMe}
          count={post.scrapCount}
          onToggleIcon={handleScrapToggle}
          iconName="Bookmark"
          activeColor="blue"
        />
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
                {isLoading && <div className="py-4 text-center text-gray-500">불러오는 중...</div>}

                {/* 에러 */}
                {isError && (
                  <div className="py-4 text-center text-red-500">
                    좋아요 목록을 불러오지 못했습니다.
                  </div>
                )}

                {/* 목록 */}
                {!isLoading &&
                  !isError &&
                  likedUsers.map((user) => (
                    <SheetItem
                      key={user.id}
                      title={user.name}
                      node={<Avatar size="xs" src={user.profileImageUrl} className="rounded-3!" />}
                    />
                  ))}

                {/* 비어 있을 때 */}
                {!isLoading && !isError && likedUsers.length === 0 && (
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
