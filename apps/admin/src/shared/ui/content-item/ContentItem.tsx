import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import DEFAULT_BANNER_IMAGE from '@/shared/assets/images/banner/banner-default-item.png';
import { ContentsType } from '@/shared/types/contents';
import { ContentActiveBadge } from '@/shared/ui/content-item/ContentActiveBadge';
import { ContentBadge } from '@/shared/ui/content-item/ContentBadge';
import { set } from 'react-hook-form';

type BadgeSpec = { kind: 'contents'; type: ContentsType } | { kind: 'active'; active: boolean };

interface ContentItemProps {
  id: number;
  imageUrl?: string;
  name: string;
  isReorderMode: boolean;
  badge?: BadgeSpec;
  hasThumbnail?: boolean;
  onClick?: (id: number) => void;
}

function renderBadge(badge?: BadgeSpec) {
  if (!badge) return null;

  switch (badge.kind) {
    case 'contents':
      return <ContentBadge type={badge.type} />;
    case 'active':
      return <ContentActiveBadge isActive={badge.active} />;
  }
}

export const ContentItem = ({
  id,
  imageUrl,
  name,
  badge,
  isReorderMode,
  onClick,
  hasThumbnail = false,
}: ContentItemProps) => {
  // 이미지 로드 실패 상태 관리
  const [isError, setIsError] = useState(false);
  // 에러가 났거나 URL이 비어있으면 기본 이미지, 아니면 원래 이미지
  const thumbnailSrc = useMemo(() => {
    if (isError || !imageUrl?.trim()) return DEFAULT_BANNER_IMAGE;
    return imageUrl;
  }, [isError, imageUrl]);

  useEffect(() => {
    setIsError(false);
  }, [imageUrl]);

  return (
    <button
      className={`flex w-full min-w-0 items-center gap-10 px-14 py-11 text-left ${isReorderMode ? 'pl-0' : ''}`}
      onClick={() => onClick?.(id)}
      disabled={isReorderMode}
      type="button"
    >
      {hasThumbnail && (
        <div className="relative h-[3rem] w-[4.875rem]">
          <Image
            src={thumbnailSrc}
            alt={name}
            fill
            className="shrink-0 object-cover"
            onError={() => setIsError(true)}
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col items-start gap-5">
        <div className="text-body-body6 text-foreground-normal w-full min-w-0 flex-1 truncate">
          {name}
        </div>

        {renderBadge(badge)}
      </div>
    </button>
  );
};
