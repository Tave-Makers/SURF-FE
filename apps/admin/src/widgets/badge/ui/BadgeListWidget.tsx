'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import { BadgeListItem } from '@/entities/badge/ui/BadgeListItem';
import { useBadgeListQuery } from '@/features/badge/model/queries/useBadgeListQuery';
import { PAGE_ROUTES } from '@/shared/config/path';
import { ErrorState } from '@/shared/ui/error/ErrorState';

export const BadgeListWidget = () => {
  const router = useRouter();
  const { badges, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useBadgeListQuery();

  const triggerRef = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !badges) {
    return <ErrorState message="배지 목록을 불러오지 못했습니다." />;
  }

  if (badges.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center px-13">
        <p className="text-body-body8 text-foreground-tertiary">등록된 뱃지가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      {badges.map((badge) => (
        <BadgeListItem
          key={badge.id}
          badgeId={badge.id}
          imageUrl={badge.imageUrl}
          name={badge.name}
          onClick={() => router.push(PAGE_ROUTES.BADGE_MNG.DETAIL(badge.id))}
        />
      ))}
      <div ref={triggerRef} className="h-10" aria-hidden="true" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4" role="status" aria-label="로딩 중">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      )}
    </div>
  );
};
