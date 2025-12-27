'use client';

import Image, { type StaticImageData } from 'next/image';
import { forwardRef, type HTMLAttributes } from 'react';

type ActivityBadgeProps = HTMLAttributes<HTMLDivElement> & {
  src?: string | StaticImageData;
  alt?: string;
  badgeName: string;
  timestamp?: string;
  loading?: boolean;
};

export const ActivityBadge = forwardRef<HTMLDivElement, ActivityBadgeProps>(
  ({ src, alt = '', badgeName, timestamp, loading = false, className = '', ...rest }, ref) => {
    const badgeBox = 'relative w-[4.0625rem] h-[4.0625rem] rounded-full overflow-hidden';

    return (
      <div
        ref={ref}
        className={['flex flex-col items-center justify-center gap-10', className].join(' ')}
        role="group"
        aria-label={
          loading
            ? '배지 로딩 중'
            : `배지: ${badgeName}${timestamp ? `, 획득 일자 ${timestamp}` : ''}`
        }
        {...rest}
      >
        <div className={badgeBox}>
          {loading ? (
            <div className="bg-background-quaternary h-full w-full animate-pulse rounded-full" />
          ) : src ? (
            <Image
              src={src}
              alt={alt || badgeName}
              fill
              sizes="4.0625rem"
              className="object-cover"
            />
          ) : (
            // TODO: 기본 배지 이미지로 교체 필요
            <div aria-hidden className="bg-background-quaternary h-full w-full rounded-full" />
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-3">
          {loading ? (
            <>
              <div className="bg-background-quaternary h-[1.25rem] w-[4.06rem] animate-pulse" />
              <div className="bg-background-quaternary h-[0.87rem] w-[4.06rem] animate-pulse" />
            </>
          ) : (
            <>
              <div className="text-body-body8 text-foreground-normal truncate">{badgeName}</div>
              {timestamp && (
                <time
                  className="text-caption-caption4 text-foreground-tertiary"
                  dateTime={timestamp}
                >
                  {timestamp}
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
