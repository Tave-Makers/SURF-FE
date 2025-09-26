'use client';

import Image from 'next/image';
import { useEffect, useState, type ReactNode } from 'react';

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
  alt?: string; // ✅ alt prop 추가
  fallback?: ReactNode;
};

export function ProfileImage({
  src,
  size = 'l',
  className,
  priority,
  alt = '', // ✅ 기본값을 빈 문자열로 설정
  fallback,
}: ProfileImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(!!src);

  // ✅ src 변경 시 상태 초기화
  useEffect(() => {
    setError(false);
    setLoading(!!src);
  }, [src]);

  const base = `relative flex items-center justify-center flex-shrink-0 aspect-square 
     rounded-[0.5rem] overflow-hidden bg-black/5 ${sizes[size].cls}`;

  return (
    <div
      className={className ? `${base} ${className}` : base}
      aria-busy={loading} // ✅ 로딩 상태 보조기기 노출
    >
      {src && !error ? (
        <>
          {loading &&
            (fallback ?? (
              <div
                className={`${sizes[size].cls} bg-background-quaternary animate-pulse`}
                role="status"
                aria-label="프로필 이미지 로딩 중"
              />
            ))}
          <Image
            src={src}
            alt={alt} // ✅ alt prop 연결
            fill
            sizes={`${sizes[size].px}px`}
            className={`object-cover transition-opacity duration-100 ${
              loading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={() => setError(true)}
            onLoadingComplete={() => setLoading(false)}
            priority={priority}
          />
        </>
      ) : (
        (fallback ?? (
          <Image
            src="/images/profile-default.svg"
            alt={alt}
            fill
            sizes={`${sizes[size].px}px`}
            className="object-cover"
          />
        ))
      )}
    </div>
  );
}
