import { InfiniteData } from '@tanstack/react-query';
import { SignupRequestListData } from '../api/types';
import { toSignupRequestMember } from './mapper';

/**
 * 다음 페이지 번호 계산
 *
 * @param lastPage - 마지막으로 로드된 페이지 데이터
 * @returns 다음 페이지 번호 또는 undefined (더 이상 페이지 없음)
 *
 * @example
 * // 마지막 페이지가 아닌 경우
 * getNextPageNumber({ isLast: false, pageNumber: 2 }) // 3
 *
 * // 마지막 페이지인 경우
 * getNextPageNumber({ isLast: true, pageNumber: 5 }) // undefined
 */
export function getNextPageNumber(lastPage: SignupRequestListData): number | undefined {
  return lastPage.isLast ? undefined : lastPage.pageNumber + 1;
}

/**
 * 무한스크롤 데이터 변환
 *
 * InfiniteQuery의 페이지별 데이터를 하나의 배열로 병합하고,
 * API DTO를 도메인 SignupRequestMember로 변환하여 반환합니다.
 *
 * @param data - InfiniteQuery의 원본 데이터
 * @returns 변환된 데이터 객체
 *
 * @example
 * const result = transformInfiniteData(infiniteQueryData);
 * // {
 * //   pages: [...],
 * //   pageParams: [...],
 * //   members: [모든 페이지의 content를 SignupRequestMember로 변환한 배열],
 * //   totalCount: 첫 페이지의 numberOfElements,
 * //   isLast: 마지막 페이지의 isLast
 * // }
 */
export function transformInfiniteData(data: InfiniteData<SignupRequestListData>) {
  const members = data.pages.flatMap((page) => page.content.map(toSignupRequestMember));
  const lastPage = data.pages[data.pages.length - 1];

  return {
    pages: data.pages,
    pageParams: data.pageParams,
    members,
    totalCount: data.pages[0]?.numberOfElements ?? 0,
    isLast: lastPage?.isLast ?? true,
  };
}
