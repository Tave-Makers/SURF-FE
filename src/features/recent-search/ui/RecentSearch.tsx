'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchHistoryItem from '@/shared/ui/search-history-item/SearchHistoryItem';
import { deleteAllRecentSearches } from '../api/deleteAllRecentSearches.client';
import { deleteOneRecentSearch } from '../api/deleteOneRecentSearches.client';
import { useAlertStore } from '@/shared/store/alertStore';

const textStyle = 'text-body-body6 text-foreground-normal';

interface RecentSearchProps {
  recentKeywords: string[];
}

export default function RecentSearch({ recentKeywords }: RecentSearchProps) {
  const router = useRouter();
  const [items, setItems] = useState(recentKeywords);

  const handleSelect = (k: string) => {
    router.push(`/board/search?keyword=${encodeURIComponent(k)}`);
  };

  const openAlert = useAlertStore((s) => s.open);
  const closeAlert = useAlertStore((s) => s.close);

  const deleteAll = () => {
    void (async () => {
      try {
        await deleteAllRecentSearches();
        setItems([]);
        closeAlert();
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    })();
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
          onClick: deleteAll,
        },
      ],
    });
  };

  const handleDeleteOne = (k: string) => {
    void (async () => {
      try {
        await deleteOneRecentSearch(k);
        setItems((prev) => prev.filter((x) => x !== k));
        router.refresh();
      } catch (e) {
        console.error(e);
      }
    })();
  };

  return (
    <section className="flex w-full flex-col gap-13 px-13 pt-16">
      <div className="flex w-full flex-row justify-between">
        <span className={textStyle}>최근 검색어</span>

        {items.length > 0 && (
          <button className={textStyle} type="button" onClick={handleDeleteAll}>
            전체 삭제
          </button>
        )}
      </div>

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
}
