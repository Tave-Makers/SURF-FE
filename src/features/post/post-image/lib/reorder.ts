/**
 * 배열 내 요소의 순서를 변경하는 유틸 함수
 *
 * @template T 배열의 타입
 * @param array 원본 배열
 * @param from 이동할 요소의 인덱스
 * @param to 이동할 위치의 인덱스
 * @returns 새로 순서가 바뀐 배열
 */
export function reorderArray<T>(array: T[], from: number, to: number): T[] {
  const copy = [...array];
  const [moved] = copy.splice(from, 1); // from 위치의 요소 꺼내기
  copy.splice(to, 0, moved); // to 위치로 삽입
  return copy;
}
