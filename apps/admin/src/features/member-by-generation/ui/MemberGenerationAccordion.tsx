'use client';

import { useInfiniteScroll } from '@surf/hooks';
import { Accordion } from '@surf/ui/accordion';
import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useMemberBaseListQuery } from '@/entities/member/model/queries/useMemberBaseListQuery';
import type { MemberBase } from '@/entities/member/model/types';

import { MemberList } from '@/entities/member/ui/MemberList';
import { useMembersByGenerationInfiniteQuery } from '@/features/member-by-generation/model/useMembersByGenerationInfiniteQuery';

type Props = {
  generation: number;
  label?: string;
  keyword?: string;
  defaultOpen?: boolean;
  renderItem: (m: MemberBase) => ReactNode;
};

export const MemberGenerationAccordion = ({
  generation,
  label,
  keyword,
  defaultOpen = false,
  renderItem,
}: Props) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  //아코디언이 열리면 데이터 fetch
  const { memberIds, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useMembersByGenerationInfiniteQuery({
      filters: { generation, keyword },
      enabled: open,
    });

  const { members, isHydrated } = useMemberBaseListQuery(memberIds);

  const onToggle = (nextOpen: boolean) => {
    // 다시 열 때 이전 스크롤 위치가 유지되면 footer가 바로 보일 수 있어 상단으로 리셋
    if (nextOpen && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    setOpen(nextOpen);
  };

  const triggerRef = useInfiniteScroll({
    enabled: open,
    isFetching: isFetchingNextPage,
    hasNextPage: Boolean(hasNextPage),
    onLoadMore: () => {
      void fetchNextPage();
    },
  });

  return (
    <Accordion title={label ?? `${generation}기`} onToggle={onToggle} defaultOpen={defaultOpen}>
      <div ref={contentRef} className="max-h-[36vh] overflow-y-auto">
        <MemberList
          members={members}
          isLoading={open && (isLoading || !isHydrated)}
          renderItem={renderItem}
        />
        <div ref={triggerRef} className="h-10" />
        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
          </div>
        )}
      </div>
    </Accordion>
  );
};
