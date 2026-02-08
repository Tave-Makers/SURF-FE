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
  // 입력값 검증
  if (!Number.isInteger(from) || !Number.isInteger(to)) {
    throw new Error('from과 to는 정수여야 합니다');
  }
  if (from < 0 || from >= array.length || to < 0 || to >= array.length) {
    throw new Error(`인덱스가 범위를 벗어났습니다 (배열 길이: ${array.length})`);
  }
  if (from === to) {
    return array; // 불필요한 복사 방지
  }

  const copy = [...array];
  const [moved] = copy.splice(from, 1); // from 위치의 요소 꺼내기
  copy.splice(to, 0, moved); // to 위치로 삽입
  return copy;
}
