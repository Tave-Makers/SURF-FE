import { TextButton } from '@surf/ui/button';

interface RequestListTopBarProps {
  mode: 'select' | 'view';
  totalCount: number;
  selectCount: number;
  onClickSelect?: () => void;
  onClickCancel?: () => void;
}
export const RequestListTopBar = ({
  mode,
  totalCount,
  selectCount,
  onClickSelect,
  onClickCancel,
}: RequestListTopBarProps) => {
  if (mode === 'select') {
    return (
      <div className="flex w-full flex-row items-center justify-between px-16 py-10">
        <span className="text-body-body8 text-foreground-normal-lighter text-nowrap">
          {selectCount}개 선택됨
        </span>
        <div className="inline-block">
          <TextButton type="button" size="s" variant="secondary" onClick={onClickCancel}>
            취소
          </TextButton>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-row items-center justify-between px-16 py-10">
      <span className="text-body-body8 text-foreground-normal-lighter text-nowrap">
        전체 {totalCount}
      </span>

      <div className="inline-block">
        <TextButton type="button" size="s" variant="primary" onClick={onClickSelect}>
          선택하기
        </TextButton>
      </div>
    </div>
  );
};
