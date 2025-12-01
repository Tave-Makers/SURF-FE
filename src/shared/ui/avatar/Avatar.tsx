'use client';

import Image from 'next/image';
import { useState } from 'react';
import DEFAULT_PROFILE_IMAGE from '@/shared/assets/icons/profile/profile-default.png';

/**
 *
 * @param src - 이미지 URL (선택). 없거나 로드 실패 시 기본 프로필 이미지로 대체
 * @param size - 아바타 크기 (기본: 'l'). 'xs' | 's' | 'm' | 'l' | 'xl'
 * @param priority - Next.js Image priority 속성 (LCP 최적화용)
 * @param className - 추가 CSS 클래스
 * @param alt - 이미지 대체 텍스트 (기본: '프로필 이미지')
 * @param onClick - 클릭 핸들러. 제공 시 button 요소로 렌더링되어 접근성 향상
 *
 */

export type AvatarSize = 'xs' | 's' | 'm' | 'l' | 'xl';

const sizesStyle = {
  xs: { cls: 'w-[1.5rem] h-[1.5rem]', px: 24, rounded: 'rounded-3' },
  s: { cls: 'w-[2.25rem] h-[2.25rem]', px: 36, rounded: 'rounded-4' },
  m: { cls: 'w-[2.5rem]  h-[2.5rem]', px: 40, rounded: 'rounded-4' },
  l: { cls: 'w-[4.5rem]  h-[4.5rem]', px: 72, rounded: 'rounded-4' },
  xl: { cls: 'w-[6rem]    h-[6rem]', px: 96, rounded: 'rounded-4' },
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

  const base = `relative flex items-center justify-center flex-shrink-0 aspect-square ${sizesStyle[size].rounded} overflow-hidden ${sizesStyle[size].cls}`;

  const imageSrc = !error && src ? src : DEFAULT_PROFILE_IMAGE;

  // interactive 여부에 따라 wrapper element 결정
  const Wrapper = onClick ? 'button' : 'div';
  const wrapperProps = onClick ? { onClick, type: 'button' as const } : {};

  return (
    <Wrapper className={`${base} ${className}`} {...wrapperProps}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        sizes={`${sizesStyle[size].px}px`}
        className="object-cover"
        priority={priority}
        onError={() => setError(true)}
      />
    </Wrapper>
  );
}
