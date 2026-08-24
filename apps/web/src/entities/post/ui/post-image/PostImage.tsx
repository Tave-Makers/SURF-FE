'use client';
import Image from 'next/image';
import { useState } from 'react';

export const PostImage = ({ src, alt }: { src: string; alt: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="flex h-[200px] w-full items-center justify-center rounded-[0.5rem] bg-gray-200 text-sm text-gray-500">
        이미지 로드에 실패했어요
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="100vw"
      style={{ width: '100%', height: 'auto' }}
      className="rounded-[0.5rem]"
      onError={() => setError(true)}
    />
  );
};
