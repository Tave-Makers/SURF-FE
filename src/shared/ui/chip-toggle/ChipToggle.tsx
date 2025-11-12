import { SurfIcon } from '@/shared/ui/icon/SurfIcon';
import { ComponentProps } from 'react';

/**
 * ChipToggle 컴포넌트 (Controlled Component)
 *
 * 부모 컴포넌트가 `isClicked`와 `count` 상태를 직접 관리해야 하는 Controlled Component입니다.
 * 내부에서는 상태를 보관하지 않으며, 클릭 이벤트를 통해 부모 콜백을 호출합니다.
 *
 * 구성:
 * - 좌측 아이콘 클릭 시 `onToggleIcon` 콜백이 실행되어 새로운 상태를 부모에게 전달합니다.
 * - 우측 숫자 클릭 시 `onClickNumber` 콜백이 실행됩니다.
 *   만약 `onClickNumber`가 전달되지 않았다면, 기본적으로 `onToggleIcon`이 실행됩니다.
 *
 * @param {ChipToggleProps} props
 * @param {SurfIconName} props.iconName - 표시할 아이콘 이름
 * @param {boolean} [props.isClicked=false] - 현재 클릭 상태 (부모에서 관리)
 * @param {number} [props.count=0] - 숫자 값 (부모에서 관리)
 * @param {(newState: boolean) => void} [props.onToggleIcon] - 아이콘 클릭 시 호출되는 콜백
 * @param {string} [props.activeColor='foreground-foreground-danger'] - 활성화 상태일 때 적용할 색상 클래스
 * @param {() => void} [props.onClickNumber] - 숫자 클릭 시 호출되는 콜백 (없으면 `onToggleIcon`이 기본 실행됨)
 *
 * @example
 * ```tsx
 * const [isClicked, setIsClicked] = useState(false);
 * const [count, setCount] = useState(42);
 *
 * <ChipToggle
 *   iconName="Heart"
 *   isClicked={isClicked}
 *   count={count}
 *   activeColor="foreground-foreground-primary"
 *   onToggleIcon={(newState) => {
 *     setIsClicked(newState);
 *     setCount((prev) => prev + (newState ? 1 : -1));
 *   }}
 *   // onClickNumber를 전달하지 않으면 숫자 클릭 시 자동으로 onToggleIcon 실행
 * />
 * ```
 */

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

export type ChipToggleProps = {
  iconName: SurfIconName;
  isClicked: boolean;
  count: number;
  onToggleIcon: (newState: boolean) => void;
  activeColor: string;
  onClickNumber?: () => void;
};

export const ChipToggle = ({
  iconName,
  isClicked,
  count,
  onToggleIcon,
  onClickNumber,
  activeColor,
}: ChipToggleProps) => {
  const baseStyle =
    'relative flex items-center justify-center gap-8 h-[2.25rem] rounded-max border px-13 w-fit';
  const colorStyle = 'bg-background-background-normal-lighter border-border-border-normal';
  const interactionStyle =
    'hover:bg-background-background-secondary-darker hover:border-border-border-secondary active:bg-background-background-secondary-darker active:border-border-border-secondary';

  const handleToggle = () => {
    onToggleIcon(!isClicked);
  };

  return (
    <div
      className={`${baseStyle} ${colorStyle} ${interactionStyle}`}
      role="group"
      aria-label={`${iconName} 토글 버튼 그룹`}
    >
      {/* 실제 콘텐츠 */}
      <div className="pointer-events-none relative z-10 flex items-center justify-center gap-8">
        <SurfIcon
          name={iconName}
          size="s"
          className={`shrink-0 ${
            isClicked
              ? `text-${activeColor} fill-${activeColor}`
              : 'text-foreground-foreground-normal'
          }`}
        />
        <span className="text-body-body7 text-foreground-foreground-normal">{count}</span>
      </div>

      {/* 클릭 영역 1: 아이콘 */}
      <button
        type="button"
        aria-label={isClicked ? '토글 해제' : '토글'}
        aria-pressed={isClicked}
        onClick={handleToggle}
        className="rounded-max absolute inset-y-0 left-0 w-1/2 cursor-pointer"
      />

      {/* 클릭 영역 2: 숫자 */}
      <button
        type="button"
        onClick={() => {
          if (onClickNumber) {
            onClickNumber();
          } else {
            handleToggle();
          }
        }}
        className="rounded-max absolute inset-y-0 right-0 w-1/2 cursor-pointer"
      />
    </div>
  );
};
