'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import DEFAULT_PROFILE_IMAGE from '@/shared/assets/icons/profile/profile-default.png';

export type ProfileImageSize = 's' | 'm' | 'l' | 'xl';

const sizes = {
  s: { cls: 'w-[2.25rem] h-[2.25rem]', px: 36 },
  m: { cls: 'w-[2.5rem]  h-[2.5rem]', px: 40 },
  l: { cls: 'w-[4.5rem]  h-[4.5rem]', px: 72 },
  xl: { cls: 'w-[6rem]    h-[6rem]', px: 96 },
} as const;

export type ProfileImageProps = {
  src?: string;
  size?: ProfileImageSize;
  className?: string;
  priority?: boolean;
  alt?: string;
};

export function ProfileImage({
  src,
  size = 'l',
  className,
  priority,
  alt = '',
}: ProfileImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!!src);

  useEffect(() => {
    setError(false);
    setLoading(!!src);
  }, [src]);

  const base = `relative flex items-center justify-center flex-shrink-0 aspect-square 
     rounded-[0.5rem] overflow-hidden bg-black/5 ${sizes[size].cls}`;

  const fallback = (
    <Image
      src={DEFAULT_PROFILE_IMAGE}
      alt={alt}
      fill
      sizes={`${sizes[size].px}px`}
      className="object-cover"
    />
  );

  return (
    <div className={className ? `${base} ${className}` : base} aria-busy={loading}>
      {src && !error ? (
        <>
          {loading && (
            <div
              className={`${sizes[size].cls} bg-background-quaternary animate-pulse`}
              role="status"
              aria-label="프로필 이미지 로딩 중"
            />
          )}
          <Image
            src={src}
            alt={alt}
            fill
            sizes={`${sizes[size].px}px`}
            className={`object-cover transition-opacity duration-100 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => {
              setError(true);
              setLoading(false);
            }}
            onLoadingComplete={() => setLoading(false)}
            priority={priority}
          />
        </>
      ) : (
        fallback
      )}
    </div>
  );
}
