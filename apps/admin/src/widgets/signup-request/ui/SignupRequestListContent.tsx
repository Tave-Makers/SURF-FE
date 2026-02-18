'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { SignupRequestMember } from '@/entities/signup-request/model/types';
import { SignupRequestList } from '@/features/signup-request/ui/SignupRequestList';

interface SignupRequestListContentProps {
  members: SignupRequestMember[];
  isSelectionEnabled: boolean;
  selectedIds: Set<number>;
  onToggleSelect: (memberId: number) => void;
  onClickMore: (memberId: number) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

/**
 * 가입 신청 목록 콘텐츠 컴포넌트
 *
 */
export const SignupRequestListContent = ({
  members,
  isSelectionEnabled,
  selectedIds,
  onToggleSelect,
  onClickMore,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: SignupRequestListContentProps) => {
  // 무한 스크롤 트리거
  const triggerRef = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore,
  });

  return (
    <div className="scrollbar-hide flex-1 overflow-y-auto">
      <SignupRequestList
        members={members}
        isSelectionEnabled={isSelectionEnabled}
        selectedIds={selectedIds}
        onToggleSelect={onToggleSelect}
        onClickMore={onClickMore}
      />
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
