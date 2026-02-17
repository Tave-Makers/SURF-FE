import Image from 'next/image';
import { ContentActiveBadge } from './ContentActiveBadge';
import DEFAULT_BANNER_IMAGE from '@/shared/assets/images/banner/banner-default-item.png';
import { ContentsType } from '@/shared/types/contents';

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
      // return <ContentsBadge type={badge.type} />;
      return null; // <- ContentsBadge 준비되면 위 주석 해제
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
  const thumbnailSrc = imageUrl?.trim() ? imageUrl : DEFAULT_BANNER_IMAGE;
  return (
    <button
      className={`flex w-full min-w-0 items-center gap-10 px-14 py-11 text-left ${isReorderMode ? 'pl-0' : ''}`}
      onClick={() => onClick?.(id)}
      disabled={isReorderMode}
      type="button"
    >
      {hasThumbnail && (
        <Image
          src={thumbnailSrc}
          alt={name}
          width={78}
          height={48}
          className="shrink-0 object-cover"
        />
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
