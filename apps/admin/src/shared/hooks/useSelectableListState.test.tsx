import { act, renderHook } from '@testing-library/react';
import { useSelectableListState } from './useSelectableListState';

describe('useSelectableListState', () => {
  test('선택 모드 진입, 토글, 선택 모드 종료가 동작한다', () => {
    const { result } = renderHook(() => useSelectableListState<number>());

    expect(result.current.mode).toBe('view');
    expect(result.current.selectedCount).toBe(0);

    act(() => {
      result.current.enterSelectMode();
      result.current.toggleSelect(1);
      result.current.toggleSelect(2);
    });

    expect(result.current.mode).toBe('select');
    expect(result.current.selectedCount).toBe(2);
    expect(result.current.selectedIds.has(1)).toBe(true);
    expect(result.current.selectedIds.has(2)).toBe(true);

    act(() => {
      result.current.exitSelectMode();
    });

    expect(result.current.mode).toBe('view');
    expect(result.current.selectedCount).toBe(0);
  });

  test('resetSelectionState는 모드와 선택 상태를 초기화한다', () => {
    const { result } = renderHook(() => useSelectableListState<number>({ initialMode: 'select' }));

    act(() => {
      result.current.toggleSelect(10);
      result.current.toggleSelect(20);
    });

    expect(result.current.mode).toBe('select');
    expect(result.current.selectedCount).toBe(2);

    act(() => {
      result.current.resetSelectionState();
    });

    expect(result.current.mode).toBe('view');
    expect(result.current.selectedCount).toBe(0);
  });
});
