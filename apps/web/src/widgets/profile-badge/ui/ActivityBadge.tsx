'use client';

import Image, { type StaticImageData } from 'next/image';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';

type ActivityBadgeProps = HTMLAttributes<HTMLDivElement> & {
  src?: string | StaticImageData;
  alt?: string;
  badgeName: string;
  timestamp?: string;
  loading?: boolean;
  scale?: number | 'responsive';
};

const responsiveWidth = 'max(291.55px, 91.4667dvw)';
const badgeRoot = 'flex w-[var(--activity-badge-width)] max-w-full flex-col items-center';
const badgeImageBox =
  'bg-foreground-tertiary-lighter relative aspect-[343/80] w-full overflow-hidden rounded-4';

function formatBadgeDate(timestamp?: string) {
  if (!timestamp) return '';

  const match = timestamp.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return timestamp;

  return `${match[1].slice(2)}.${match[2]}.${match[3]}`;
}

export const ActivityBadge = forwardRef<HTMLDivElement, ActivityBadgeProps>(
  (
    {
      src,
      alt = '',
      badgeName,
      timestamp,
      loading = false,
      scale = 'responsive',
      className = '',
      style,
      ...rest
    },
    ref,
  ) => {
    const badgeStyle = {
      '--activity-badge-width': typeof scale === 'number' ? `${343 * scale}px` : responsiveWidth,
      ...style,
    } as CSSProperties;
    const formattedDate = formatBadgeDate(timestamp);

    return (
      <div
        ref={ref}
        className={[badgeRoot, className].filter(Boolean).join(' ')}
        style={badgeStyle}
        role="group"
        aria-label={
          loading
            ? '배지 로딩 중'
            : `배지: ${badgeName}${timestamp ? `, 획득 일자 ${timestamp}` : ''}`
        }
        {...rest}
      >
        <div className={badgeImageBox}>
          {loading ? (
            <div className="bg-background-quinary rounded-5 h-full w-full animate-pulse" />
          ) : src ? (
            <Image
              src={src}
              alt={alt || badgeName}
              fill
              sizes="(min-width: 430px) 429px, 343px"
              className="object-cover"
            />
          ) : (
            // TODO: 기본 배지 이미지로 교체 필요
            <div aria-hidden className="bg-background-quaternary rounded-5 h-full w-full" />
          )}
        </div>

        <div className="mt-8 flex max-w-full min-w-0 flex-col items-center gap-7 text-center">
          {loading ? (
            <>
              <div className="bg-background-quaternary rounded-3 h-[1.5rem] w-[10rem] max-w-full animate-pulse" />
              <div className="bg-background-quaternary rounded-3 h-[1.5rem] w-[5rem] max-w-full animate-pulse" />
            </>
          ) : (
            <>
              <div className="text-body-body8 text-foreground-normal max-w-full truncate">
                {badgeName}
              </div>
              {formattedDate && (
                <time
                  className="text-caption-caption4 text-foreground-quinary-darker"
                  dateTime={timestamp}
                >
                  {formattedDate}
                </time>
              )}
            </>
          )}
        </div>
      </div>
    );
  },
);

ActivityBadge.displayName = 'ActivityBadge';
