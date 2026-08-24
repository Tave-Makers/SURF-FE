import { Avatar } from '@surf/ui/avatar';
import { InfoBadge } from '@surf/ui/info-badge';
import { MemberSearchItem } from '../model/types';
import { USER_LEVEL_BADGE } from '@/entities/user/ui/user-level/UserLevelBadges';
import { useDynamicVisibleCount } from '@/shared/hooks/useDynamicVisibleCount';

interface MemberItemProps {
  user: MemberSearchItem;
  keyword?: string; // 검색어가 있으면 학교를, 없으면 소개글을 보여줌
  onClick?: () => void;
}

export const MemberItem = ({ user, keyword, onClick }: MemberItemProps) => {
  const { name, university, bio, level, chips, isBlocked } = user;

  const subText = keyword && keyword.trim() !== '' ? university : bio;

  const BadgeIcon = USER_LEVEL_BADGE[level];

  // 커스텀 훅 사용
  const { visibleCount, containerRef, ghostContainerRef } = useDynamicVisibleCount({
    items: chips,
    gap: 4, // 칩 간격
    moreBadgeWidth: 28, // '+N' 배지 너비
  });

  const visibleChips = chips.slice(0, visibleCount);
  const remainingCount = chips.length - visibleCount;

  return (
    // 차단한 회원은 프로필로 들어갈 수 없다 ('차단됨' 표기가 이유를 알려준다)
    <button
      onClick={onClick}
      disabled={isBlocked}
      className="flex w-full gap-11 overflow-hidden p-12 disabled:cursor-default"
    >
      {/* 프로필 이미지 */}
      <Avatar size="m" src={user.avatarUrl ?? undefined} />

      <div className="flex w-full flex-col items-start gap-7 overflow-hidden">
        {/* 헤더: 이름 + 레벨 + 칩 */}
        <header className="flex w-full items-center gap-8">
          {/* 이름 + 권한 아이콘 */}
          <h3 className="text-foreground-normal text-body-body6 flex shrink-0 items-center gap-5">
            <span>{name}</span>
            {BadgeIcon && <BadgeIcon className="h-[1.125rem] w-[1.125rem] shrink-0" />}
          </h3>

          {/* 차단 표기 — 스펙상 차단해도 목록에서 제외하지 않고 표기만 한다 */}
          {isBlocked && (
            <span className="text-caption-caption6 text-foreground-tertiary shrink-0">차단됨</span>
          )}

          {/* 기수 (칩 목록) */}
          <ul ref={containerRef} className="flex min-w-0 flex-1 gap-5 overflow-hidden">
            {visibleChips.map((chip) => (
              <li key={chip} className="flex shrink-0 items-center">
                <InfoBadge text={chip} />
              </li>
            ))}

            {/* +N개 UI 처리 */}
            {remainingCount > 0 && (
              <li className="flex shrink-0 items-center">
                <InfoBadge text={`+${remainingCount}`} />
              </li>
            )}
          </ul>
        </header>

        {/* 한 줄 소개 */}
        <p className="text-foreground-normal text-caption-caption4 w-full min-w-0 truncate text-left">
          {subText ?? ''}
        </p>
      </div>

      {/* [Ghost Container]
        화면에 보이지 않지만 너비 계산을 위해 존재. 
        실제 ul과 동일한 구조(gap, padding 등)여야 함.
      */}
      <ul
        ref={ghostContainerRef}
        aria-hidden="true"
        className="pointer-events-none invisible absolute flex items-center gap-5 opacity-0"
        style={{ top: 0, left: 0, width: 'max-content' }}
      >
        {chips.map((chip) => (
          <li key={`ghost-${chip}`}>
            <InfoBadge text={chip} />
          </li>
        ))}
      </ul>
    </button>
  );
};
