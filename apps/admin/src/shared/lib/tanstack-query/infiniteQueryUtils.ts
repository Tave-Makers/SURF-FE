import { InfiniteData } from '@tanstack/react-query';
import { PageMeta } from '@/shared/api/types';

/**
 * content 필드를 가진 페이지 데이터 인터페이스
 */
export interface PageWithContent<T> extends PageMeta {
  content: T[];
}

/**
 * 다음 페이지 번호 계산
 *
 * 무한스크롤에서 getNextPageParam에 사용하는 공통 유틸
 *
 * @param lastPage - 마지막으로 로드된 페이지 데이터
 * @returns 다음 페이지 번호 또는 undefined (더 이상 페이지 없음)
 *
 * @example
 * infiniteQueryOptions({
 *   queryFn: fetchData,
 *   getNextPageParam: getNextPageNumber,
 * });
 */
export function getNextPageNumber(lastPage: PageMeta): number | undefined {
  return lastPage.isLast ? undefined : lastPage.pageNumber + 1;
}

/**
 * 무한스크롤 select 결과 타입
 */
export interface InfiniteSelectResult<T> {
  pages: PageWithContent<T>[];
  pageParams: number[];
  items: T[];
  totalCount: number;
  isLast: boolean;
}

/**
 * 무한스크롤 데이터 선택 함수 생성
 *
 * 캐시에 저장된 페이지 데이터를 컴포넌트에서 사용하기 쉬운 형태로 변환
 * 제네릭을 활용하여 다양한 도메인 모델에서 재사용 가능
 *
 * @returns select 함수
 *
 * @example
 * // signupRequestQueryOptions에서 사용
 * infiniteQueryOptions({
 *   queryFn: fetchData,
 *   select: createInfiniteDataSelector<SignupRequestMember>(),
 * });
 */
export function createInfiniteDataSelector<T>(): (
  data: InfiniteData<PageWithContent<T>, number>,
) => InfiniteSelectResult<T> {
  return (data: InfiniteData<PageWithContent<T>, number>): InfiniteSelectResult<T> => {
    const items = data.pages.flatMap((page) => page.content);
    const lastPage = data.pages[data.pages.length - 1];

    return {
      pages: data.pages,
      pageParams: data.pageParams,
      items,
      totalCount: data.pages[0]?.numberOfElements ?? 0,
      isLast: lastPage?.isLast ?? true,
    };
  };
}
