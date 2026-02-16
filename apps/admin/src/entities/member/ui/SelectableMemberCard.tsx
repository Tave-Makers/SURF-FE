import { Checkbox } from '@surf/ui/checkbox';
import type { ReactNode } from 'react';
import { MemberCardBase } from './MemberCardBase';
import type { MemberTrack } from '@/entities/member/model/types';

interface SelectableMemberCardProps {
  /** 멤버 이름 */
  name: string;
  /** 트랙 목록 (기수 + 파트) */
  tracks: MemberTrack[];
  /** 등록 시간 (없으면 표시하지 않음) */
  registeredAt?: string;
  /** 선택 모드 활성화 여부 (true일 때 체크박스 표시 + content 클릭 토글) */
  isSelectionEnabled?: boolean;
  /** 체크 여부 */
  checked: boolean;
  /** 체크 토글 핸들러 */
  onToggle: () => void;
  /** Checkbox 오른쪽에 배치할 슬롯 (예: Avatar) */
  leftSlot?: ReactNode;
  /** 오른쪽 슬롯 (예: StatusBadge, RoleBadge) */
  rightSlot?: ReactNode;
}

/**
 * 선택 가능한 멤버 카드.
 *
 * content 영역(rightAddon 제외) 전체를 클릭하면 체크가 토글된다.
 * Checkbox 자체 클릭은 stopPropagation으로 중복 토글을 방지한다.
 */
export const SelectableMemberCard = ({
  name,
  tracks,
  registeredAt,
  isSelectionEnabled = false,
  checked,
  onToggle,
  leftSlot,
  rightSlot,
}: SelectableMemberCardProps) => {
  return (
    <MemberCardBase
      name={name}
      tracks={tracks}
      registeredAt={registeredAt}
      highlighted={isSelectionEnabled && checked}
      mainProps={
        isSelectionEnabled
          ? {
              onClick: () => onToggle(),
              role: 'checkbox',
              'aria-checked': checked,
              tabIndex: 0,
              onKeyDown: (e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggle();
                }
              },
              className: 'cursor-pointer',
            }
          : undefined
      }
      leftSlot={
        <>
          {isSelectionEnabled && (
            <div
              role="presentation"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <Checkbox
                isChecked={checked}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
                onKeyDown={(e) => e.stopPropagation()}
                aria-label={`${name} 선택`}
              />
            </div>
          )}
          {leftSlot}
        </>
      }
      rightSlot={rightSlot}
    />
  );
};
