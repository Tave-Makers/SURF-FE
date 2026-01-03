'use client';

import { useMemberSearch } from '@/features/member-search/api/useMemberSearch';
import { useMemberFilters } from '@/features/member-search/model/useMemberFilters';
import { HeaderMode } from '@/shared/ui/header/Header';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { MemberListWidget } from '@/widgets/member-search/ui/MemberListWidget';
import { MemberSearchWidget } from '@/widgets/member-search/ui/MemberSearchWidget';

export function MemberSearchPage() {
  const filters = useMemberFilters();
  const { keyword, debouncedKeyword, generation, part } = filters;

  const queryResult = useMemberSearch({ keyword, debouncedKeyword, generation, part });

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{
          mode: HeaderMode.Default,
          title: '회원',
          hasLeftIcon: true,
        }}
      />
      <MemberSearchWidget filters={filters} totalCount={queryResult.totalCount} />
      <main className="flex-1 overflow-y-auto">
        {queryResult.isError ? (
          <div className="flex flex-col items-center justify-center p-20 text-center">
            <p className="text-foreground-normal text-body-body6 mb-8">
              회원 정보를 불러오는 중 오류가 발생했습니다.
            </p>
            <button
              onClick={() => void queryResult.refetch()}
              className="bg-background-primary text-foreground-static-white rounded px-16 py-8"
            >
              다시 시도
            </button>
          </div>
        ) : (
          <MemberListWidget keyword={filters.keyword} queryResult={queryResult} />
        )}
      </main>
    </div>
  );
}
