'use client';

import Image from 'next/image';
import { useState } from 'react';
import DEFAULT_PROFILE_IMAGE from '@/shared/assets/icons/profile/profile-default.png';

export type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';

const sizes = {
  xs: { cls: 'w-[1.5rem] h-[1.5rem]', px: 24 },
  s: { cls: 'w-[2.25rem] h-[2.25rem]', px: 36 },
  m: { cls: 'w-[2.5rem]  h-[2.5rem]', px: 40 },
  l: { cls: 'w-[4.5rem]  h-[4.5rem]', px: 72 },
  xl: { cls: 'w-[6rem]    h-[6rem]', px: 96 },
} as const;

export type AvatarProps = {
  src?: string;
  size?: AvatarSize;
  priority?: boolean;
  className?: string;
  alt?: string;
  onClick?: () => void;
};

export function Avatar({
  src,
  size = 'l',
  priority,
  className = '',
  alt = '프로필 이미지',
  onClick,
}: AvatarProps) {
  const [error, setError] = useState(false);

  const base = `relative flex items-center justify-center flex-shrink-0 aspect-square 
    rounded-1 overflow-hidden ${sizes[size].cls}`;

  const imageSrc = !error && src ? src : DEFAULT_PROFILE_IMAGE;

  // interactive 여부에 따라 wrapper element 결정
  const Wrapper = onClick ? 'button' : 'div';

  return (
    <Wrapper
      className={`${base} ${className}`}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={`${sizes[size].px}px`}
        className="object-cover"
        priority={priority}
        onError={() => setError(true)}
      />
    </Wrapper>
  );
}
