'use client';

import Image from 'next/image';
import { useState, type ReactNode } from 'react';
import defaultProfileImage from '@/shared/assets/images/profile/profile-default.png';

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
  alt: string;
  size?: ProfileImageSize;
  className?: string;
  priority?: boolean;
  fallback?: ReactNode;
};

export function ProfileImage({
  src,
  alt,
  size = 'l',
  className,
  priority,
  fallback,
}: ProfileImageProps) {
  const [error, setError] = useState(false);

  const base = `relative flex items-center justify-center flex-shrink-0 aspect-square 
     rounded-[0.5rem] overflow-hidden bg-black/5 ${boxSizeClass[size]}`;

  return (
    <div className={className ? `${base} ${className}` : base}>
      {src && !error ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={`${pxMap[size]}px`}
          className="object-cover"
          onError={() => setError(true)}
          priority={priority}
        />
      ) : (
        (fallback ?? (
          <Image
            src={defaultProfileImage}
            alt={alt}
            fill
            sizes={`${pxMap[size]}px`}
            className="object-cover"
          />
        ))
      )}
    </div>
  );
}
