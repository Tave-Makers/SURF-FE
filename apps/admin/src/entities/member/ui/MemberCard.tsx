import { Checkbox } from '@surf/ui/checkbox';
import { SurfIcon } from '@surf/ui/icon';
import { InfoBadge } from '@surf/ui/info-badge';
import type { ChangeEvent, ReactNode } from 'react';
import { PART_LABELS } from '@/entities/member/model/constants';
import type { MemberTrack } from '@/entities/member/model/types';

interface MemberCardProps {
  /** 멤버 이름 */
  name: string;
  /** 트랙 목록 (기수 + 파트) */
  tracks: MemberTrack[];
  /** 등록 시간 (없으면 표시하지 않음) */
  registeredAt?: string;
  /** 체크 여부 */
  checked: boolean;
  /** 선택 모드 활성화 여부 (true일 때 체크박스 표시) */
  isSelectionEnabled?: boolean;
  /** 체크박스 토글 핸들러 */
  onToggle: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 상세 보기 버튼 클릭 핸들러 (없으면 버튼 숨김) */
  onClick?: () => void;
  /** 체크박스와 콘텐츠 사이에 렌더링되는 슬롯 (예: Avatar) */
  leftAddon?: ReactNode;
  /** 상세 보기 버튼 왼쪽에 렌더링되는 슬롯 (예: StatusBadge, RoleBadge) */
  rightSlot?: ReactNode;
}

/**
 * 재사용 가능한 멤버 카드 컴포넌트.
 *
 * `leftAddon`과 `rightSlot`을 통해 화면별로 다른 요소를 주입할 수 있다.
 *
 * @example
 * // 가입 신청 목록
 * <MemberCard
 *   name="테이비"
 *   tracks={[{ generation: 15, part: 'DESIGN' }]}
 *   registeredAt="25.12.31 16:32"
 *   checked={false}
 *   onToggle={handleToggle}
 *   onClick={handleClick}
 *   rightSlot={<RequestStatusBadge status="waiting" />}
 * />
 *
 * @example
 * // 멤버 관리 목록
 * <MemberCard
 *   name="테이비"
 *   tracks={[{ generation: 15, part: 'DESIGN' }]}
 *   checked={false}
 *   onToggle={handleToggle}
 *   onClick={handleClick}
 *   leftAddon={<Avatar src={profileImageUrl} size="s" />}
 *   rightSlot={<RoleBadge role="PRESIDENT" />}
 * />
 */
export const MemberCard = ({
  name,
  tracks,
  registeredAt,
  checked,
  isSelectionEnabled = false,
  onToggle,
  onClick,
  leftAddon,
  rightSlot,
}: MemberCardProps) => {
  return (
    <div
      className={`border-border-secondary flex flex-row items-start gap-13 border-b px-14 py-11 ${
        checked ? 'bg-background-notification' : ''
      }`}
    >
      {isSelectionEnabled && (
        <Checkbox
          isChecked={checked}
          onChange={onToggle}
          isDisabled={!isSelectionEnabled}
          aria-label={`${name} 선택`}
        />
      )}

      {leftAddon}

      <div className="flex w-full grow flex-col items-start gap-5 overflow-hidden">
        <h3 className="text-body-body6 text-foreground-normal">{name}</h3>
        <div className="flex flex-row gap-5">
          <InfoBadge text={`${tracks[0].generation}기 ${PART_LABELS[tracks[0].part]}`} />
          {tracks.length > 1 && <InfoBadge text={`+${tracks.length - 1}`} />}
        </div>
        {registeredAt && (
          <span className="text-body-body11 text-foreground-secondary">
            <time dateTime={registeredAt} aria-label={`등록 시간 ${registeredAt}`}>
              {registeredAt}
            </time>
          </span>
        )}
      </div>

      {(rightSlot || onClick) && (
        <div className="mt-7 flex flex-row gap-8">
          {rightSlot}
          {onClick && (
            <button type="button" onClick={onClick} aria-label={`${name} 상세 보기`}>
              <SurfIcon name="ChevronRight" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
