'use client';

import Image, { type StaticImageData } from 'next/image';
import { forwardRef, type HTMLAttributes } from 'react';
import DefaultCircleUrl from '@/shared/assets/icons/profile/default-circle.svg?url';

type ActivityBadgeProps = HTMLAttributes<HTMLDivElement> & {
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  badgeName: string;
  timestamp?: string;
  loading?: boolean;
};

export const ActivityBadge = forwardRef<HTMLDivElement, ActivityBadgeProps>(
  (
    { imageSrc, imageAlt = '', badgeName, timestamp, loading = false, className = '', ...rest },
    ref,
  ) => {
    const badgeBox = 'relative w-[4.06rem] h-[4.06rem] rounded-full overflow-hidden';

    return (
      <div
        ref={ref}
        className={['flex flex-col items-center justify-center gap-[0.62rem]', className].join(' ')}
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
            <div className="bg-background-quaternary h-full w-full animate-pulse" />
          ) : (
            <Image
              src={imageSrc || DefaultCircleUrl}
              alt={imageAlt || badgeName}
              fill
              sizes="4.06rem"
              className="object-cover"
              placeholder="empty"
              priority={false}
            />
          )}
        </div>

        <div className="flex flex-col items-center justify-center gap-[2px]">
          {loading ? (
            <>
              <div className="bg-background-quaternary h-[1.25rem] w-[4.06rem] animate-pulse" />
              <div className="bg-background-quaternary h-[0.87rem] w-[4.06rem] animate-pulse" />
            </>
          ) : (
            <>
              <div className="text-body-14-600--1-20 text-border-contrast truncate">
                {badgeName}
              </div>
              {timestamp && (
                <time className="text-caption-12-400 text-border-normal" dateTime={timestamp}>
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
