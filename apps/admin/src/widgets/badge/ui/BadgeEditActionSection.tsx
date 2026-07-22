import { SolidButton } from '@surf/ui/button';

type BadgeEditActionSectionProps = {
  isDisabled?: boolean;
  onDelete: () => void;
};

/**
 * 배지 수정 화면에서 사용하는 삭제 액션 섹션.
 */
export const BadgeEditActionSection = ({
  isDisabled = false,
  onDelete,
}: BadgeEditActionSectionProps) => {
  return (
    // 배지 자체를 삭제하는 위험 액션 영역
    <div className="px-13">
      <SolidButton size="m" variant="warning" isDisabled={isDisabled} onClick={onDelete}>
        해당 배지 삭제하기
      </SolidButton>
    </div>
  );
};
