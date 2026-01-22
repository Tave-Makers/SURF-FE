'use client';

import { useSignupRequestList } from '@/features/signup-request/model/queries/useSignupRequestList';
import { SignupRequestList } from '@/features/signup-request/ui/SignupRequestList';
import { useInfiniteScroll } from '@/shared/hooks/useInfiniteScroll';

interface SignupRequestListContentProps {
  keyword: string;
}

/**
 * 가입 신청 목록 콘텐츠 컴포넌트
 *
 */
export const SignupRequestListContent = ({ keyword }: SignupRequestListContentProps) => {
  const { members, fetchNextPage, hasNextPage, isFetchingNextPage } = useSignupRequestList({
    keyword,
  });

  // 무한 스크롤 트리거
  const triggerRef = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto">
      <SignupRequestList members={members} />
      {/* 무한 스크롤 트리거 */}
      <div ref={triggerRef} className="h-10" />
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      )}
    </div>
  );
};
