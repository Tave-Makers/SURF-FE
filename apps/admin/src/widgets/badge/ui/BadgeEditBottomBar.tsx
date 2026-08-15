import { useKeyboardOffset } from '@surf/hooks';
import { SolidButton } from '@surf/ui/button';

type BadgeEditBottomBarProps = {
  canSubmit: boolean;
  isSubmitting: boolean;
  onSubmit: () => void;
};

/**
 * 배지 수정 화면 하단에 고정되는 저장 버튼 영역.
 */
export const BadgeEditBottomBar = ({
  canSubmit,
  isSubmitting,
  onSubmit,
}: BadgeEditBottomBarProps) => {
  const keyboardOffset = useKeyboardOffset();

  return (
    // 키보드가 올라와도 저장 버튼이 가려지지 않도록 하단 여백을 보정한다.
    <div
      className="bg-background-normal shadow-embossed-inverse sticky bottom-0 px-13 pt-13"
      style={{
        paddingBottom: `calc(max(env(safe-area-inset-bottom), ${keyboardOffset}px) + 16px)`,
      }}
    >
      <SolidButton
        size="l"
        variant="primary"
        isDisabled={!canSubmit || isSubmitting}
        onClick={onSubmit}
      >
        수정하기
      </SolidButton>
    </div>
  );
};
