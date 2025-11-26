'use client';
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
    <img src={src} alt={alt} className="w-full rounded-[0.5rem]" onError={() => setError(true)} />
  );
};
