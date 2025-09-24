'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

type ProfileImageSize = 's' | 'm' | 'l' | 'xl';

const boxSizeClass: Record<ProfileImageSize, string> = {
  s: 'w-[2.25rem] h-[2.25rem]',
  m: 'w-[2.5rem]  h-[2.5rem]',
  l: 'w-[4.5rem]  h-[4.5rem]',
  xl: 'w-[6rem]    h-[6rem]',
};

const pxMap: Record<ProfileImageSize, number> = { s: 36, m: 40, l: 72, xl: 96 };

export type ProfileImageProps = {
  src?: string;
  size?: ProfileImageSize;
  className?: string;
  priority?: boolean;
  fallback?: ReactNode;
};

export function ProfileImage({
  src,
  size = 'l',
  className,
  priority,
  fallback,
}: ProfileImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!!src);

  const base = `relative flex items-center justify-center flex-shrink-0 aspect-square 
     rounded-[0.5rem] overflow-hidden bg-black/5 ${boxSizeClass[size]}`;

  return (
    <div className={className ? `${base} ${className}` : base}>
      {src && !error ? (
        <>
          {loading &&
            (fallback ?? (
              <div
                className={`${boxSizeClass[size]} bg-background-quaternary animate-pulse`}
                role="status"
                aria-label="프로필 이미지 로딩 중"
              />
            ))}
          <Image
            src={src}
            alt="프로필 이미지"
            fill
            sizes={`${pxMap[size]}px`}
            className={`object-cover transition-opacity duration-100 ${loading ? 'opacity-0' : 'opacity-100'}`}
            onError={() => setError(true)}
            onLoadingComplete={() => setLoading(false)}
            priority={priority}
          />
        </>
      ) : (
        (fallback ?? (
          <Image
            src="/images/profile-default.svg"
            alt="프로필 이미지"
            fill
            sizes={`${pxMap[size]}px`}
            className="object-cover"
          />
        ))
      )}
    </div>
  );
}
