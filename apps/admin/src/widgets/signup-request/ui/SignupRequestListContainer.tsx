import { useInfiniteScroll } from '@surf/hooks';
import { useCallback } from 'react';
import { SignupRequestActionBar } from '../../../features/signup-request/ui/SignupRequestActionBar';
import { useMemberBaseListQuery } from '@/entities/member/model/queries/useMemberBaseListQuery';
import { useSignupRequestList } from '@/features/signup-request/model/queries/useSignupRequestList';
import { SignupRequestList } from '@/features/signup-request/ui/SignupRequestList';
import { useBottomSheetStore } from '@/shared/store/bottomSheetStore';

interface SignupRequestListContainerProps {
  keyword: string;
  mode: 'view' | 'select';
  selectedIds: Set<number>;
  onToggleSelect: (memberId: number) => void;
  resetSelectionState: () => void;
}

const Spinner = () => (
  <div className="flex justify-center py-4">
    <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
  </div>
);
export const SignupRequestListContainer = ({
  keyword,
  mode,
  selectedIds,
  onToggleSelect,
  resetSelectionState,
}: SignupRequestListContainerProps) => {
  const { memberIds, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSignupRequestList(keyword);
  const { members, isHydrated } = useMemberBaseListQuery(memberIds);

  const openBottomSheet = useBottomSheetStore((s) => s.open);

  const triggerRef = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  const handleOpenDetail = useCallback(
    (memberId: number) => {
      openBottomSheet({
        type: 'signup',
        props: {
          memberId,
          showAction: mode === 'view',
        },
      });
    },
    [mode, openBottomSheet],
  );

  return (
    <>
      <div className="scrollbar-hide flex-1 overflow-y-auto">
        {isHydrated || memberIds.length === 0 ? (
          <SignupRequestList
            members={members}
            isSelectionEnabled={mode === 'select'}
            selectedIds={selectedIds}
            onToggleSelect={onToggleSelect}
            onClickMore={handleOpenDetail}
          />
        ) : (
          <Spinner />
        )}
        <div ref={triggerRef} className="h-10" />
        {isFetchingNextPage && <Spinner />}
      </div>
      <SignupRequestActionBar
        members={members}
        selectedIds={selectedIds}
        mode={mode}
        resetSelectionState={resetSelectionState}
      />
    </>
  );
};
