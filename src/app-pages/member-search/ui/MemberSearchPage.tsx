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
        <MemberListWidget keyword={filters.keyword} queryResult={queryResult} />
      </main>
    </div>
  );
}
