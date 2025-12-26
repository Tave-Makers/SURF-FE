import { useMemberSearch } from '@/features/member-search/api/useMemberSearch';
import { MemberList } from '@/entities/search/ui/MemberList';
import { useCallback, useRef } from 'react';

interface MemberListWidgetProps {
  queryResult: ReturnType<typeof useMemberSearch>;
}

export function MemberListWidget({ queryResult }: MemberListWidgetProps) {
  const { members, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = queryResult;

  // IntersectionObserver 인스턴스를 저장할 ref
  const observer = useRef<IntersectionObserver | null>(null);

  // 마지막 요소가 화면에 들어왔을 때 실행될 콜백 ref
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      // 로딩 중이면 관찰을 시작하지 않음
      if (isLoading) return;

      // 이전 관찰자가 있다면 연결 해제
      if (observer.current) observer.current.disconnect();

      // 새로운 관찰자 생성 및 설정
      observer.current = new IntersectionObserver((entries) => {
        // 요소가 화면에 보이고, 다음 페이지가 있다면 데이터 호출
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      });

      // 노드가 존재하면 관찰 시작
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage],
  );

  if (isLoading) return <div className="p-10 text-center">불러오는 중...</div>;

  return (
    <div className="flex flex-col divide-y divide-gray-50">
      <MemberList members={members} />

      {/* 무한 스크롤 트리거 지점: lastElementRef를 ref로 전달 */}
      <div ref={lastElementRef} className="flex h-10 w-full items-center justify-center">
        {isFetchingNextPage && (
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600" />
        )}
      </div>
    </div>
  );
}
