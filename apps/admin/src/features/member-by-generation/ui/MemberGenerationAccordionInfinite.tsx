'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import { useMemberBaseListQuery } from '@/entities/member/model/queries/useMemberBaseListQuery';
import type { MemberBase } from '@/entities/member/model/types';
import { MemberGenerationAccordion } from '@/entities/member/ui/MemberGenerationAccordion';
import { useMembersByGenerationInfiniteQuery } from '@/features/member-by-generation/model/useMembersByGenerationInfiniteQuery';

type Props = {
  generation: number;
  label?: string;
  keyword?: string;
  renderItem: (m: MemberBase) => ReactNode;
};

export const MemberGenerationAccordionInfinite = ({
  generation,
  label,
  keyword,
  renderItem,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [contentRoot, setContentRoot] = useState<HTMLDivElement | null>(null);

  //아코디언이 열리면 데이터 fetch
  const { memberIds, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMembersByGenerationInfiniteQuery({
      filters: { generation, keyword },
      enabled: open,
    });

  const { members, isHydrated } = useMemberBaseListQuery(memberIds);

  const onToggle = useCallback(
    (nextOpen: boolean) => {
      // 다시 열 때 이전 스크롤 위치가 유지되면 footer가 바로 보일 수 있어 상단으로 리셋
      if (nextOpen && contentRoot) {
        contentRoot.scrollTop = 0;
      }
      setOpen(nextOpen);
    },
    [contentRoot],
  );

  const triggerRef = useInfiniteScroll({
    enabled: open && Boolean(contentRoot),
    root: contentRoot,
    isFetching: isFetchingNextPage,
    hasNextPage: open && Boolean(hasNextPage),
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  return (
    <MemberGenerationAccordion
      generation={generation}
      label={label}
      members={members}
      isLoading={open && (isLoading || !isHydrated)}
      contentRef={setContentRoot}
      contentClassName="max-h-[56vh] overflow-y-auto"
      renderItem={renderItem}
      onToggle={onToggle}
      footer={
        <>
          <div ref={triggerRef} className="h-10" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
            </div>
          )}
        </>
      }
    />
  );
};
