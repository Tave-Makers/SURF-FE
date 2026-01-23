'use client';

import { HeaderMode } from '@surf/ui/header';
// import dynamic from 'next/dynamic';
import { useMemberSearch } from '@/features/member-search/api/useMemberSearch';
import { useMemberFilters } from '@/features/member-search/model/useMemberFilters';
import SearchEmpty from '@/shared/assets/icons/empty-space/search-empty.svg';
import { AppHeader } from '@/widgets/header/ui/AppHeader';
import { MemberListWidget } from '@/widgets/member-search/ui/MemberListWidget';
import { MemberSearchWidget } from '@/widgets/member-search/ui/MemberSearchWidget';

// const SearchEmpty = dynamic(() => import('@/shared/assets/icons/empty-space/search-empty.svg'), {
//   ssr: false,
//     loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
// });

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
                <span className="text-body-body6 text-foreground-tertiary">
                  회원 정보를 불러오는 중 오류가 발생했습니다.
                </span>
                <button
                  onClick={() => void queryResult.refetch()}
                  className="bg-background-primary text-foreground-static-white rounded px-16 py-8"
                >
                  다시 시도
                </button>
              </>
            )}

            {isLoading && (
              <></> //임시
            )}

            {isEmpty && (
              <>
                <SearchEmpty className="h-[5.59944rem] w-[5.59944rem]" />
                <span className="text-body-body8 text-foreground-tertiary">검색 결과가 없어요</span>
              </>
            )}
          </div>
        )}

        {!showState && <MemberListWidget keyword={filters.keyword} queryResult={queryResult} />}
      </main>
    </div>
  );
};
