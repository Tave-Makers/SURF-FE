import { SolidButton } from '@surf/ui/button';

type ButtonAction = {
  key: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
};

type BottomActionBarProps = {
  actions: ButtonAction[];
};

/**
 * 하단에 고정되는 액션 버튼 컴포넌트
 * actions로 최대 2개의 버튼을 전달해 하단 CTA 영역을 구성한다.
 */
export const BottomActionBar = ({ actions }: BottomActionBarProps) => {
  if (actions.length === 0) return null;

  if (actions.length > 2) throw new Error('BottomActionBar supports up to 2 actions.');

  return (
    <div className="mx-auto flex w-full sm:w-[min(100dvw,calc(100dvh*375/812))]">
      <div className="w-full max-w-screen-sm pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="flex h-[4.5rem] w-full">
          {actions.map((a) => (
            <div key={a.key} className="flex-1">
              <SolidButton
                size="l"
                variant={a.variant || 'primary'}
                isDisabled={a.disabled}
                onClick={a.onClick}
                className="h-full w-full rounded-none"
              >
                {a.label}
              </SolidButton>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
