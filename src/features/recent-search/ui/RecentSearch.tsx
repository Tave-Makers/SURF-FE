'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import SearchHistoryItem from '@/shared/ui/search-history-item/SearchHistoryItem';
import { deleteAllRecentSearches } from '../api/deleteAllRecentSearches.client';
import { deleteOneRecentSearch } from '../api/deleteOneRecentSearch.client';
import { useAlertStore } from '@/shared/store/alertStore';

const textStyle = 'text-body-body6 text-foreground-normal';

interface RecentSearchProps {
  recentKeywords: string[];
}

export default function RecentSearch({ recentKeywords }: RecentSearchProps) {
  const router = useRouter();
  const [items, setItems] = useState(recentKeywords);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelect = (k: string) => {
    router.push(`/board/search?keyword=${encodeURIComponent(k)}`);
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

  const handleDeleteOne = async (k: string) => {
    const ok = await deleteOneRecentSearch(k);
    if (!ok) {
      console.error(`Failed to delete recent search: ${k}`);
      return;
    }
    setItems((prev) => prev.filter((x) => x !== k));
    router.refresh();
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

      <div className="flex flex-wrap gap-8">
        {items.map((k) => (
          <SearchHistoryItem
            key={k}
            keyword={k}
            onSelect={() => handleSelect(k)}
            onDelete={() => {
              void handleDeleteOne(k);
            }}
          />
        ))}
      </div>
    </section>
  );
}
