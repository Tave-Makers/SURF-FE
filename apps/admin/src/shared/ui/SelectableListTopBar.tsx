import { TextButton } from '@surf/ui/button';

interface SelectableListTopBarProps {
  mode: 'select' | 'view';
  totalCount: number;
  selectedCount: number;
  onEnterSelectMode?: () => void;
  onExitSelectMode?: () => void;
  viewCountLabel?: (totalCount: number) => string;
  selectedCountLabel?: (selectedCount: number) => string;
  selectButtonLabel?: string;
  cancelButtonLabel?: string;
}

export const SelectableListTopBar = ({
  mode,
  totalCount,
  selectedCount,
  onEnterSelectMode,
  onExitSelectMode,
  viewCountLabel = (count) => `전체 ${count}`,
  selectedCountLabel = (count) => `${count}개 선택됨`,
  selectButtonLabel = '선택하기',
  cancelButtonLabel = '취소',
}: SelectableListTopBarProps) => {
  if (mode === 'select') {
    return (
      <div className="border-b-border-normal flex w-full flex-row items-center justify-between border-b px-13 py-10">
        <span className="text-body-body8 text-foreground-normal-lighter text-nowrap">
          {selectedCountLabel(selectedCount)}
        </span>

        <div className="inline-block">
          <TextButton type="button" size="s" variant="secondary" onClick={onExitSelectMode}>
            {cancelButtonLabel}
          </TextButton>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b-border-normal flex w-full flex-row items-center justify-between border-b px-13 py-10">
      <span className="text-body-body8 text-foreground-normal-lighter text-nowrap">
        {viewCountLabel(totalCount)}
      </span>

      {totalCount > 0 && (
        <div className="inline-block">
          <TextButton type="button" size="s" variant="primary" onClick={onEnterSelectMode}>
            {selectButtonLabel}
          </TextButton>
        </div>
      )}
    </div>
  );
};
