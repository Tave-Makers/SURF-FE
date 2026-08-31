'use client';

import { useInfiniteScroll } from '@surf/hooks';

import { BlockedMemberList, useBlockedMembersQuery, useUnblockMember } from '@/features/block';
import BlockEmpty from '@/shared/assets/icons/empty-space/block-empty.svg';

const BlockedMembersPage = () => {
  const {
    data: members,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useBlockedMembersQuery();
  const confirmUnblock = useUnblockMember();

  const loadMoreRef = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  if (isLoading) return <div className="flex h-full w-full items-center justify-center" />;

  if (isError) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="text-body-body8 text-foreground-tertiary">
          차단한 회원을 불러오지 못했습니다.
        </span>
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-5">
        <BlockEmpty aria-hidden="true" focusable="false" />
        <span className="text-body-body8 text-foreground-tertiary">차단한 회원이 없어요</span>
      </div>
    );
  }

  // (sub) 레이아웃이 overflow-hidden이라 스크롤 컨테이너는 페이지가 직접 만든다
  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        <BlockedMemberList members={members} onSelectMember={confirmUnblock} />
        {hasNextPage && <div ref={loadMoreRef} className="h-1 w-full" aria-hidden />}
      </div>
    </div>
  );
};

export default BlockedMembersPage;
