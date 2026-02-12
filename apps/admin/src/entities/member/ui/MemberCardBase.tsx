import { InfoBadge } from '@surf/ui/info-badge';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { PART_LABELS } from '@/entities/member/model/constants';
import type { MemberTrack } from '@/entities/member/model/types';

interface MemberCardBaseProps {
  /** 멤버 이름 */
  name: string;
  /** 트랙 목록 (기수 + 파트) */
  tracks: MemberTrack[];
  /** 등록 시간 (없으면 표시하지 않음) */
  registeredAt?: string;
  /** 배경 하이라이트 (예: 선택 상태) */
  highlighted?: boolean;
  /** content 영역 왼쪽 슬롯 (예: Checkbox, Avatar, 삭제 아이콘) */
  leftSlot?: ReactNode;
  /** 오른쪽 슬롯 (예: Badge, Chevron) — content 영역 바깥에 렌더링 */
  rightSlot?: ReactNode;
  /** main 영역에 전달할 추가 HTML 속성 (예: onClick, role, aria-*) */
  mainProps?: ComponentPropsWithoutRef<'div'>;
}

/**
 * 멤버 카드 Base 컴포넌트 (표시 전용).
 *
 */
export const MemberCardBase = ({
  name,
  tracks,
  registeredAt,
  highlighted = false,
  leftSlot,
  rightSlot,
  mainProps,
}: MemberCardBaseProps) => {
  return (
    <div
      className={`border-border-secondary flex flex-row items-start border-b px-14 py-11 ${
        highlighted ? 'bg-background-notification' : ''
      }`}
    >
      <div
        {...mainProps}
        className={`flex grow flex-row items-start gap-11 ${mainProps?.className ?? ''}`}
      >
        {leftSlot}

        <div className="flex w-full grow flex-col items-start gap-5 overflow-hidden">
          <h3 className="text-body-body6 text-foreground-normal">{name}</h3>
          {tracks.length > 0 && (
            <div className="flex flex-row gap-5">
              <InfoBadge text={`${tracks[0].generation}기 ${PART_LABELS[tracks[0].part]}`} />
              {tracks.length > 1 && <InfoBadge text={`+${tracks.length - 1}`} />}
            </div>
          )}
          {registeredAt && (
            <span className="text-body-body11 text-foreground-secondary">{registeredAt}</span>
          )}
        </div>
      </div>

      {rightSlot && <div className="mt-7 flex flex-row gap-8">{rightSlot}</div>}
    </div>
  );
};
