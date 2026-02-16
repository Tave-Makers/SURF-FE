import { useCallback, useState } from 'react';

export type SelectMode = 'select' | 'view';
export type SelectableId = number | string;

interface UseSelectableListStateOptions {
  initialMode?: SelectMode;
}

export const useSelectableListState = <TId extends SelectableId = number>({
  initialMode = 'view',
}: UseSelectableListStateOptions = {}) => {
  const [mode, setMode] = useState<SelectMode>(initialMode);
  const [selectedIds, setSelectedIds] = useState<Set<TId>>(new Set());

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const enterSelectMode = useCallback(() => {
    setMode('select');
  }, []);

  const exitSelectMode = useCallback(() => {
    setMode('view');
    clearSelection();
  }, [clearSelection]);

  const toggleSelect = useCallback((id: TId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetSelectionState = useCallback(() => {
    setMode('view');
    clearSelection();
  }, [clearSelection]);

  return {
    mode,
    selectedIds,
    selectedCount: selectedIds.size,
    setSelectedIds,
    clearSelection,
    enterSelectMode,
    exitSelectMode,
    toggleSelect,
    resetSelectionState,
  };
};
