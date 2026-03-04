'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { MemberList } from '@/entities/search/ui/MemberList';
import { trackMemberSearchEvent } from '@/features/member-search/lib/trackMemberSearchEvent';
import { MEMBER_SEARCH_EVENTS } from '@/features/member-search/model/constants';
import { useInfiniteMemberSearchQuery } from '@/features/member-search/model/queries/useInfiniteMemberSearchQuery';
import { PAGE_ROUTES } from '@/shared/config/path';

interface MemberListWidgetProps {
  keyword?: string; // 검색어가 있으면 학교를, 없으면 소개글을 보여줌
  queryResult: ReturnType<typeof useInfiniteMemberSearchQuery>;
  onTrackMemberSearch: (rawKeyword?: string) => void;
}

export const MemberListWidget = ({
  keyword,
  queryResult,
  onTrackMemberSearch,
}: MemberListWidgetProps) => {
  const router = useRouter();

  const { members, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = queryResult;

  function handleClick(userId: number) {
    onTrackMemberSearch(keyword);
    trackMemberSearchEvent(MEMBER_SEARCH_EVENTS.MEMBER_CLICK, { member_id: String(userId) });
    router.push(PAGE_ROUTES.MEMBER.PROFILE(userId));
  }

  // IntersectionObserver 인스턴스를 저장할 ref
  const observer = useRef<IntersectionObserver | null>(null);

  // IntersectionObserver 생성 및 정리
  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 observer 정리
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  // 마지막 요소가 화면에 들어왔을 때 실행될 콜백 ref
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      // 로딩 중이면 관찰을 시작하지 않음
      if (isLoading) return;

      // 이전 관찰자가 있다면 연결 해제
      if (observer.current) observer.current.disconnect();

      // 새로운 관찰자 생성 및 설정
      observer.current = new IntersectionObserver(
        (entries) => {
          // 요소가 화면에 보이고, 다음 페이지가 있다면 데이터 호출
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
          }
        },
        { rootMargin: '100px' },
      ); // 100px 전에 미리 로딩 시작

      // 노드가 존재하면 관찰 시작
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  return (
    <div className="flex flex-col">
      <MemberList members={members} keyword={keyword} onClick={handleClick} />

      {/* 무한 스크롤 트리거 지점: lastElementRef를 ref로 전달 */}
      <div ref={lastElementRef} className="flex h-10 w-full items-center justify-center">
        {isFetchingNextPage && (
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
        )}
      </div>
    </div>
  );
};
