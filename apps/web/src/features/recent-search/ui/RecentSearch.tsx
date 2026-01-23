'use client';

import { SearchHistoryItem } from '@surf/ui/search-history-item';
import { useAlertStore } from '@surf/ui/store/alertStore';
// import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { deleteAllRecentSearches } from '../api/deleteAllRecentSearches.client';
import { deleteOneRecentSearch } from '../api/deleteOneRecentSearch.client';
import SearchEmpty from '@/shared/assets/icons/empty-space/search-empty.svg';
import { PAGE_ROUTES } from '@/shared/config/path';

const textStyle = 'text-body-body6 text-foreground-normal';

// const SearchEmpty = dynamic(() => import('@/shared/assets/icons/empty-space/search-empty.svg'), {
//   ssr: false,
//     loading: () => <div className="h-[90px] w-[90px] rounded-5 bg-background-normal-lighter" aria-hidden="true" />,
// });

interface RecentSearchProps {
  recentKeywords: string[];
}

export const RecentSearch = ({ recentKeywords }: RecentSearchProps) => {
  const router = useRouter();
  const [items, setItems] = useState(recentKeywords);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelect = (k: string) => {
    router.push(`${PAGE_ROUTES.BOARD.SEARCH}?keyword=${encodeURIComponent(k)}`);
  };

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const deleteAll = async () => {
    setIsDeleting(true);
    try {
      const ok = await deleteAllRecentSearches();
      if (!ok) throw new Error('deleteAll failed');

      setItems([]);
      closeAlert();
      router.refresh();
    } catch (e) {
      console.error(e);
      openAlert({
        state: 'error',
        title: '삭제 실패',
        infoText: '최근 검색어 삭제 중 오류가 발생했습니다. 다시 시도해주세요.',
        actions: [
          {
            type: 'solid',
            label: '확인',
            variant: 'primary',
            onClick: closeAlert,
          },
        ],
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAll = () => {
    openAlert({
      state: 'default',
      title: '최근 검색어를 전부 삭제하시겠습니까?',
      infoText: '삭제하기를 누를 경우에 최근 검색어가 전부 삭제됩니다.',
      actions: [
        {
          type: 'text',
          label: '취소',
          variant: 'secondary',
          onClick: closeAlert,
        },
        {
          type: 'solid',
          label: '삭제하기',
          variant: 'danger',
          onClick: () => {
            void deleteAll();
          },
        },
      ],
    });
  };

  const handleDeleteOne = (k: string) => {
    void (async () => {
      const ok = await deleteOneRecentSearch(k);
      if (!ok) {
        return;
      }
      setItems((prev) => prev.filter((x) => x !== k));
      router.refresh();
    })();
  };

  return (
    <section className="flex w-full flex-col gap-13 px-13 pt-16">
      <div className="flex w-full flex-row justify-between">
        <span className={textStyle} aria-label="최근 검색어">
          최근 검색어
        </span>

        {items.length > 0 && (
          <button
            className={textStyle}
            type="button"
            onClick={handleDeleteAll}
            aria-label="최근 검색어 전체 삭제"
            disabled={isDeleting}
          >
            전체 삭제
          </button>
        )}
      </div>

      {items.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 pt-[3.37rem]">
          <SearchEmpty className="h-[4.34rem] w-[4.34rem]" />
          <span className="text-body-body8 text-foreground-tertiary">검색 결과가 없어요</span>
        </div>
      )}

      <div className="flex flex-wrap gap-8">
        {items.map((k) => (
          <SearchHistoryItem
            key={k}
            keyword={k}
            onSelect={handleSelect}
            onDelete={() => handleDeleteOne(k)}
          />
        ))}
      </div>
    </section>
  );
};
