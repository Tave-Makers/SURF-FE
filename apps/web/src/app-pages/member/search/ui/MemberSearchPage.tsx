'use client';

import { HeaderMode } from '@surf/ui/header';
import { useMemberSearch } from '@/features/member-search/api/useMemberSearch';
import { useMemberFilters } from '@/features/member-search/model/useMemberFilters';
import SearchEmptyIcon from '@/shared/assets/icons/empty-space/search-empty.svg';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { MemberListWidget } from '@/widgets/member-search/ui/MemberListWidget';
import { MemberSearchWidget } from '@/widgets/member-search/ui/MemberSearchWidget';

export const MemberSearchPage = () => {
  const filters = useMemberFilters();
  const { keyword, debouncedKeyword, generation, part } = filters;

  const queryResult = useMemberSearch({ keyword, debouncedKeyword, generation, part });

  const isError = queryResult.isError;
  const isLoading = queryResult.isLoading;
  const isEmpty = !isError && !isLoading && queryResult.totalCount === 0;

  const showState = isError || isLoading || isEmpty;

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
        {showState && (
          <div className="flex h-full flex-col items-center justify-center gap-3 pb-25">
            {isError && (
              <>
                <p className="text-body-body6 text-foreground-tertiary">
                  회원 정보를 불러오는 중 오류가 발생했습니다.
                </p>
                <button
                  onClick={() => void queryResult.refetch()}
                  className="bg-background-primary text-foreground-static-white rounded px-16 py-8"
                >
                  다시 시도
                </button>
              </>
            )}

            {isLoading && (
              <p className="text-body-body8 text-foreground-tertiary">불러오는 중...</p>
            )}

            {isEmpty && (
              <>
                <SearchEmptyIcon className="h-[90px] w-[90px]" />
                <p className="text-body-body8 text-foreground-tertiary">검색 결과가 없어요</p>
              </>
            )}
          </div>
        )}

        {!showState && <MemberListWidget keyword={filters.keyword} queryResult={queryResult} />}
      </main>
    </div>
  );
};
