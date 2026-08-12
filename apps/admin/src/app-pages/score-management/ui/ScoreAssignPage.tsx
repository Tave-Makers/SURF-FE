'use client';

import { Accordion } from '@surf/ui/accordion';
import { HeaderMode } from '@surf/ui/header';
import Link from 'next/link';
import { useMemo } from 'react';
import { filterIndividualScoreCategories } from '@/entities/activity-score/model/criterion';
import { useActivityTypesQuery } from '@/entities/activity-score/model/queries/useActivityTypesQuery';
import { PAGE_ROUTES } from '@/shared/config/path';
import { AppHeader } from '@/widgets/header/ui/AppHeader';

export const ScoreAssignPage = () => {
  const { data: allCategories = [], isLoading, isError } = useActivityTypesQuery();

  // 대상 선택 화면이 회원만 지원하므로 팀 대상 활동은 노출하지 않는다.
  const categories = useMemo(() => filterIndividualScoreCategories(allCategories), [allCategories]);

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        overrideHeader={{ mode: HeaderMode.Default, title: '회원 점수 부여', hasLeftIcon: true }}
      />

      <div className="scrollbar-hide flex-1 overflow-y-auto">
        {isLoading && (
          <div className="text-body-body9 text-foreground-tertiary px-13 py-12">Loading...</div>
        )}
        {isError && (
          <div className="text-body-body9 text-foreground-tertiary px-13 py-12">
            활동 종류를 불러오지 못했습니다.
          </div>
        )}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="text-body-body9 text-foreground-tertiary px-13 py-12">
            등록된 활동 종류가 없습니다.
          </div>
        )}
        {!isLoading &&
          !isError &&
          categories.map((category) => (
            <Accordion key={category.id} title={category.title} defaultOpen={category.defaultOpen}>
              <ul className="pb-7">
                {category.criteria.map((criterion) => (
                  <li key={criterion.id}>
                    <Link
                      href={PAGE_ROUTES.SCORE_MNG_ASSIGN_TARGET(criterion.id)}
                      className="text-body-body6 text-foreground-normal block w-full px-12 py-10 text-left"
                    >
                      {criterion.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
      </div>
    </div>
  );
};
