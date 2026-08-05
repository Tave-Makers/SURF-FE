'use client';

import { Avatar } from '@surf/ui/avatar';
import { InfoBadge } from '@surf/ui/info-badge';
import type { IntegrationTarget } from '../model/types';
import { useDynamicVisibleCount } from '@/shared/hooks/useDynamicVisibleCount';

interface IntegrationTargetCardProps {
  target: IntegrationTarget;
}

export const IntegrationTargetCard = ({ target }: IntegrationTargetCardProps) => {
  const { username, profileImageUrl, selfIntroduction, chips } = target;

  const { visibleCount, containerRef, ghostContainerRef } = useDynamicVisibleCount({
    items: chips,
    gap: 4,
    moreBadgeWidth: 28,
  });

  const visibleChips = chips.slice(0, visibleCount);
  const remainingCount = chips.length - visibleCount;

  return (
    <div className="border-border-secondary flex w-full gap-11 overflow-hidden border-b px-13 py-12">
      <Avatar size="m" src={profileImageUrl ?? undefined} />

      <div className="flex w-full flex-col justify-center gap-7 overflow-hidden">
        <header className="flex w-full items-center gap-8">
          <h3 className="text-foreground-normal text-body-body6 shrink-0">{username}</h3>

          <ul ref={containerRef} className="flex min-w-0 flex-1 gap-5 overflow-hidden">
            {visibleChips.map((chip) => (
              <li key={chip} className="flex shrink-0 items-center">
                <InfoBadge text={chip} />
              </li>
            ))}

            {remainingCount > 0 && (
              <li className="flex shrink-0 items-center">
                <InfoBadge text={`+${remainingCount}`} />
              </li>
            )}
          </ul>
        </header>

        {selfIntroduction && (
          <p className="text-foreground-normal text-caption-caption4 w-full min-w-0 truncate text-left">
            {selfIntroduction}
          </p>
        )}
      </div>

      {/* [Ghost Container] 배지 노출 개수 계산용. 화면에는 보이지 않는다. */}
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
    </div>
  );
};
