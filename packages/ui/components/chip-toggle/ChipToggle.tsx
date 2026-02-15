import { ComponentProps } from 'react';
import { SurfIcon } from '../icon/SurfIcon';

/**
 * ChipToggle 컴포넌트 (Controlled Component)
 *
 * 부모 컴포넌트가 `isClicked`와 `count` 상태를 직접 관리해야 하는 Controlled Component입니다.
 * 내부에서는 상태를 보관하지 않으며, 클릭 이벤트를 통해 부모 콜백을 호출합니다.
 *
 * 하이라이트 동작 (highlightType)
 * - 'hover' (기본값): hover/active 상태에서만 배경이 진해집니다.
 * - 'toggle'        : isClicked=true 일 때 배경이 항상 진하게 유지됩니다.
 *
 * 표시 콘텐츠 (mode)
 * - 'count': `count` 숫자를 표시합니다.
 * - 'text' : `children`을 표시합니다.
 *
 * 클릭 동작
 * - 좌/우 클릭 영역 모두 기본적으로 `onToggleIcon(!isClicked)`를 호출합니다.
 * - 단, `onClickNumber`가 전달되면 “오른쪽 클릭 영역”은 `onClickNumber`를 우선 호출합니다.

 *
 * @param {ChipToggleProps} props
 * @param {SurfIconName} props.iconName - 표시할 아이콘 이름 (SurfIcon 기준)
 * @param {'count'|'text'} props.mode - 우측 영역 표시 방식
 * @param {'hover'|'toggle'} [props.highlightType='hover'] - 배경 하이라이트 방식
 * @param {boolean} props.isClicked - 현재 토글 상태 (부모에서 관리)
 * @param {number} [props.count] - mode='count'일 때 표시할 숫자
 * @param {React.ReactNode} [props.children] - mode='text'일 때 표시할 텍스트/노드
 * @param {(newState: boolean) => void} props.onToggleIcon - 토글 시 호출되는 콜백
 * @param {ActiveColorVariant} props.activeColor - isClicked=true일 때 아이콘 색상
 * @param {() => void} [props.onClickNumber] - 오른쪽 클릭 영역 동작을 분리하고 싶을 때 사용
 */

type SurfIconName = ComponentProps<typeof SurfIcon>['name'];

export type ChipToggleProps = {
  iconName?: SurfIconName;
  mode: 'count' | 'text';
  highlightType?: 'hover' | 'toggle';
  isClicked: boolean;
  count?: number; // count 모드
  children?: React.ReactNode; // text 모드
  onToggleIcon: (newState: boolean) => void;
  activeColor: ActiveColorVariant;
  onClickNumber?: () => void;
};

export type ActiveColorVariant = 'red' | 'blue';

const baseStyle =
  'relative flex items-center justify-center gap-8 h-[2.25rem] rounded-max border px-13 w-fit';
const colorStyle = 'bg-background-normal-lighter border-border-normal';
const hoverStyle =
  'hover:bg-background-secondary-darker hover:border-border-secondary active:bg-background-secondary-darker active:border-border-secondary';

const toggledStyle = 'bg-background-secondary-darker border-border-secondary';

// 색상 매핑
const colorMap: Record<ActiveColorVariant, string> = {
  red: 'text-foreground-danger fill-foreground-danger',
  blue: 'text-background-primary fill-background-primary',
};

export const ChipToggle = ({
  iconName,
  mode,
  highlightType = 'hover',
  isClicked,
  count,
  onToggleIcon,
  onClickNumber,
  activeColor,
  children,
}: ChipToggleProps) => {
  const handleToggle = () => {
    onToggleIcon(!isClicked);
  };

  const containerClassName = [
    baseStyle,
    colorStyle,

    // hover 모드일 때만 hover/active 효과
    highlightType === 'hover' && hoverStyle,

    // toggle 모드일 때는 클릭 상태면 진하게
    highlightType === 'toggle' && isClicked && toggledStyle,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClassName}
      role="group"
      aria-label={iconName ? `${iconName} 토글 버튼 그룹` : '토글 버튼 그룹'}
    >
      <div className="pointer-events-none relative flex h-full items-center justify-center gap-8">
        {iconName && (
          <SurfIcon
            name={iconName}
            size="s"
            className={`shrink-0 ${isClicked ? colorMap[activeColor] : 'text-foreground-normal'}`}
          />
        )}
        {/* count일 경우 숫자 표시 / text일 경우 children 표시 */}
        <span className="text-body-body8 text-foreground-normal">
          {mode === 'count' ? count : children}
        </span>
      </div>

      {/* 왼쪽 클릭 영역: 아이콘 */}
      <button
        type="button"
        aria-label={isClicked ? '토글 해제' : '토글'}
        aria-pressed={isClicked}
        onClick={handleToggle}
        className="rounded-max absolute inset-y-0 left-0 w-1/2 cursor-pointer"
      />

      {/* 오른쪽 클릭 영역 */}
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
